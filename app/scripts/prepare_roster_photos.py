"""Download/compress roster photos once, outside the website request path."""
import argparse
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import sys

from PIL import Image, ImageOps
import requests


REPO_ROOT = Path(__file__).resolve().parents[2]
PHOTO_DIR = REPO_ROOT / '.roster-photo-uploads'
MANIFEST_PATH = REPO_ROOT / 'front-end' / 'src' / 'assets' / 'roster-photos' / 'manifest.json'
MAX_SIDE = 960
QUALITY = 82


def compress_photo(content):
    with Image.open(BytesIO(content)) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        image.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
        output = BytesIO()
        image.save(output, format='WEBP', quality=QUALITY, method=6)
        return output.getvalue()


def prepare(sources, output_dir, manifest_path, local_photos=None):
    local_photos = local_photos or {}
    unknown_ids = local_photos.keys() - {person['key'] for person in sources}
    if unknown_ids:
        raise SystemExit(f'Unknown roster photo IDs: {sorted(unknown_ids)}')
    output_dir.mkdir(parents=True, exist_ok=True)
    previous = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
    existing = {record['key']: record for record in previous}
    manifest, failures = [], []
    with requests.Session() as session:
        for person in sources:
            key = person['key']
            cached = existing.get(key)
            local_photo = local_photos.get(key)
            # Unchanged photos are not fetched again on subsequent runs.
            if (cached and not local_photo
                    and (cached['source_url'] is None or not person['sources']
                         or cached['source_url'] == person['sources'][0]['url'])
                    and cached.get('max_side') == MAX_SIDE and cached.get('quality') == QUALITY
                    and (output_dir / cached['filename']).exists()):
                manifest.append(cached)
                continue
            candidates = ([{'path': local_photo, 'season': None}] if local_photo else person['sources'])
            for source in candidates:
                try:
                    if local_photo:
                        original = Path(source['path']).read_bytes()
                    else:
                        response = session.get(source['url'], timeout=30)
                        response.raise_for_status()
                        original = response.content
                    content = compress_photo(original)
                except (requests.RequestException, OSError, Image.DecompressionBombError) as error:
                    print(f"Could not fetch {key}: {error}", file=sys.stderr)
                    continue
                content_hash = sha256(content).hexdigest()
                filename = f'{key}.{content_hash[:5]}.webp'
                destination = output_dir / filename
                if ((cached and cached['filename'] == filename and cached['content_hash'] != content_hash)
                        or (destination.exists() and sha256(destination.read_bytes()).hexdigest() != content_hash)):
                    raise SystemExit(f'Hash collision for {filename}; existing photo was not overwritten.')
                destination.write_bytes(content)
                manifest.append({
                    'key': key, 'name': person['name'],
                    'source_url': source.get('url'), 'source_season': source['season'],
                    'content_hash': content_hash, 'filename': filename,
                    'original_bytes': len(original), 'bytes': len(content),
                    'max_side': MAX_SIDE, 'quality': QUALITY,
                })
                print(f"{key}: {len(original):,} -> {len(content):,} bytes", file=sys.stderr)
                break
            else:
                if cached:
                    manifest.append(cached)
                failures.append(key)
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    if failures:
        raise SystemExit('No new photo prepared for: ' + ', '.join(map(str, failures)))
    print(f'Prepared {len(manifest)} photos', file=sys.stderr)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', type=Path, default=PHOTO_DIR)
    parser.add_argument('--local-photo', nargs=2, action='append', default=[], metavar=('PLAYER_ID', 'PATH'),
                        help='Use a local image for an existing roster photo database ID.')
    args = parser.parse_args()
    prepare(json.load(sys.stdin), args.output_dir, MANIFEST_PATH,
            {int(player_id): Path(path) for player_id, path in args.local_photo})
