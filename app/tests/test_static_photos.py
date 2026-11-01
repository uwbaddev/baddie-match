from hashlib import sha256
from io import BytesIO
import json
import os
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import Mock, patch

os.environ.setdefault('DATABASE_URL', 'sqlite:///:memory:')
os.environ.setdefault('APP_SETTINGS', 'config.TestingConfig')

from PIL import Image
from main import app
from scripts.prepare_roster_photos import compress_photo, prepare, PHOTO_DIR


class StaticPhotoTests(unittest.TestCase):
    def test_all_bundled_images_are_small_valid_webp_files(self):
        records = json.loads((PHOTO_DIR / 'manifest.json').read_text())
        self.assertGreater(len(records), 0)
        self.assertEqual(len({record['key'] for record in records}), len(records))
        for record in records:
            content = (PHOTO_DIR / (record['key'] + '.webp')).read_bytes()
            self.assertEqual(sha256(content).hexdigest(), record['content_hash'])
            self.assertLess(len(content), 30_000)
            with Image.open(BytesIO(content)) as image:
                self.assertEqual(image.format, 'WEBP')
                self.assertLessEqual(max(image.size), 320)

    def test_compression_resizes_without_upscaling(self):
        for size in [(1200, 1800), (64, 80)]:
            raw = BytesIO()
            Image.new('RGB', size, 'red').save(raw, format='PNG')
            with Image.open(BytesIO(compress_photo(raw.getvalue()))) as image:
                self.assertLessEqual(max(image.size), 320)
                if size == (64, 80):
                    self.assertEqual(image.size, size)

    def test_built_photos_are_served_with_long_cache_headers_and_conditional_requests(self):
        record = json.loads((PHOTO_DIR / 'manifest.json').read_text())[0]
        content = (PHOTO_DIR / (record['key'] + '.webp')).read_bytes()
        with TemporaryDirectory() as directory:
            image_path = Path(directory) / 'static' / 'media' / 'player.abc123.webp'
            image_path.parent.mkdir(parents=True)
            image_path.write_bytes(content)
            (Path(directory) / 'index.html').write_text('<html>Website</html>')
            with patch.object(app, '_static_folder', directory):
                client = app.test_client()
                response = client.get('/static/media/player.abc123.webp')
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.mimetype, 'image/webp')
                self.assertEqual(response.data, content)
                self.assertIn('public', response.headers['Cache-Control'])
                self.assertIn('max-age=31536000', response.headers['Cache-Control'])
                self.assertIn('immutable', response.headers['Cache-Control'])
                self.assertNotIn('no-cache', response.headers['Cache-Control'])
                modified = response.headers['Last-Modified']
                response.close()
                cached = client.get('/static/media/player.abc123.webp', headers={
                    'If-Modified-Since': modified,
                })
                self.assertEqual(cached.status_code, 304)
                self.assertIn('immutable', cached.headers['Cache-Control'])
                cached.close()
                # HTML fallbacks must not receive the image cache lifetime.
                missing = client.get('/static/media/missing.webp')
                self.assertNotIn('immutable', missing.headers.get('Cache-Control', ''))
                missing.close()

    def test_no_photo_api_or_database_import_is_registered(self):
        rules = [str(rule) for rule in app.url_map.iter_rules()]
        self.assertFalse(any('/api/roster-photos/' in rule for rule in rules))

    def test_unchanged_sources_are_not_downloaded_again(self):
        record = json.loads((PHOTO_DIR / 'manifest.json').read_text())[0]
        with TemporaryDirectory() as directory:
            path = Path(directory)
            (path / 'manifest.json').write_text(json.dumps([record]))
            (path / (record['key'] + '.webp')).write_bytes((PHOTO_DIR / (record['key'] + '.webp')).read_bytes())
            with patch('requests.Session.get', side_effect=AssertionError('Unnecessary download')):
                prepare([{'key': record['key'], 'sources': [{'url': record['source_url']}]}], path)

    def test_failed_refresh_keeps_previous_photo(self):
        record = json.loads((PHOTO_DIR / 'manifest.json').read_text())[0]
        with TemporaryDirectory() as directory:
            path = Path(directory)
            (path / 'manifest.json').write_text(json.dumps([record]))
            image_path = path / (record['key'] + '.webp')
            original = (PHOTO_DIR / (record['key'] + '.webp')).read_bytes()
            image_path.write_bytes(original)
            with patch('requests.Session.get', return_value=Mock(content=b'not an image')):
                with self.assertRaises(SystemExit):
                    prepare([{'key': record['key'], 'sources': [{'url': 'https://example.com/new.jpg'}]}], path)
            self.assertEqual(image_path.read_bytes(), original)
            self.assertEqual(json.loads((path / 'manifest.json').read_text()), [record])


if __name__ == '__main__':
    unittest.main()
