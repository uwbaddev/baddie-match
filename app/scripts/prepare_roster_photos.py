"""Download/compress roster photos once, outside the website request path."""
import argparse
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import sys

from PIL import Image, ImageOps
import requests


PHOTO_DIR = Path(__file__).resolve().parents[1] / 'data' / 'roster_photos'


def compress_photo(content):
    with Image.open(BytesIO(content)) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        image.thumbnail((320, 320), Image.Resampling.LANCZOS)
        output = BytesIO()
        image.save(output, format='WEBP', quality=65, method=6)
        return output.getvalue()


def prepare(sources, output_dir):
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_dir / 'manifest.json'
    previous = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
    existing = {record['key']: record for record in previous}
    manifest, failures = [], []
    with requests.Session() as session:
        for person in sources:
            key = person['key']
            cached = existing.get(key)
            # Unchanged photos are not fetched again on subsequent runs.
            if (cached and cached['source_url'] == person['sources'][0]['url']
                    and (output_dir / (key + '.webp')).exists()):
                manifest.append(cached)
                continue
            for source in person['sources']:
                try:
                    response = session.get(source['url'], timeout=30)
                    response.raise_for_status()
                    content = compress_photo(response.content)
                except (requests.RequestException, OSError, Image.DecompressionBombError) as error:
                    print(f"Could not fetch {key}: {error}", file=sys.stderr)
                    continue
                (output_dir / (key + '.webp')).write_bytes(content)
                manifest.append({
                    'key': key, 'name': person['name'],
                    'source_url': source['url'], 'source_season': source['season'],
                    'content_hash': sha256(content).hexdigest(),
                    'original_bytes': len(response.content), 'bytes': len(content),
                })
                print(f"{key}: {len(response.content):,} -> {len(content):,} bytes", file=sys.stderr)
                break
            else:
                if cached:
                    manifest.append(cached)
                failures.append(key)
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    if failures:
        raise SystemExit('No new photo downloaded for: ' + ', '.join(failures))
    print(f'Prepared {len(manifest)} photos', file=sys.stderr)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', type=Path, default=PHOTO_DIR)
    args = parser.parse_args()
    prepare(json.load(sys.stdin), args.output_dir)
