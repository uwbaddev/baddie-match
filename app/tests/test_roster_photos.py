import json
import os
from hashlib import sha256
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch, Mock

os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
os.environ['APP_SETTINGS'] = 'config.TestingConfig'

from PIL import Image
from main import app, db
from src.roster_photos import RosterPhoto
from scripts.load_roster_photos import load_photos, PHOTO_DIR
from scripts.prepare_roster_photos import compress_photo, prepare


class RosterPhotoTests(unittest.TestCase):
    def setUp(self):
        self.context = app.app_context()
        self.context.push()
        RosterPhoto.__table__.create(db.engine, checkfirst=True)
        self.client = app.test_client()

    def tearDown(self):
        db.session.remove()
        RosterPhoto.__table__.drop(db.engine)
        self.context.pop()

    def test_bundle_import_is_idempotent_and_preserves_existing_timestamps(self):
        records = json.loads((PHOTO_DIR / 'manifest.json').read_text())
        self.assertGreater(len(records), 0)
        self.assertEqual(load_photos(), len(records))
        timestamp = RosterPhoto.query.first().updated_at
        self.assertEqual(load_photos(), 0)
        self.assertEqual(RosterPhoto.query.first().updated_at, timestamp)
        self.assertEqual(RosterPhoto.query.count(), len(records))

    def test_photo_response_is_cacheable_and_supports_304_without_remote_requests(self):
        load_photos()
        photo = RosterPhoto.query.get('jessica-viyan-cheng')
        with patch('requests.sessions.Session.request', side_effect=AssertionError('Remote fetch')):
            response = self.client.get('/api/roster-photos/jessica-viyan-cheng.webp')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.mimetype, 'image/webp')
            self.assertEqual(sha256(response.data).hexdigest(), photo.content_hash)
            self.assertIn('public', response.headers['Cache-Control'])
            self.assertIn('max-age=86400', response.headers['Cache-Control'])
            cached = self.client.get('/api/roster-photos/jessica-viyan-cheng.webp', headers={
                'If-None-Match': response.headers['ETag'],
            })
            self.assertEqual(cached.status_code, 304)
            self.assertEqual(cached.data, b'')
            cached_date = self.client.get('/api/roster-photos/jessica-viyan-cheng.webp', headers={
                'If-Modified-Since': response.headers['Last-Modified'],
            })
            self.assertEqual(cached_date.status_code, 304)

    def test_missing_photo_returns_404_instead_of_the_spa_page(self):
        self.assertEqual(self.client.get('/api/roster-photos/not-a-player.webp').status_code, 404)

    def test_invalid_bundle_does_not_modify_existing_photos(self):
        load_photos()
        count = RosterPhoto.query.count()
        with TemporaryDirectory() as directory:
            path = Path(directory)
            (path / 'bad.webp').write_bytes(b'wrong content')
            (path / 'manifest.json').write_text(json.dumps([{
                'key': 'bad', 'content_hash': 'incorrect',
            }]))
            with self.assertRaisesRegex(ValueError, 'checksum mismatch'):
                load_photos(path)
        self.assertEqual(RosterPhoto.query.count(), count)

    def test_refresh_updates_the_existing_row_and_invalidates_its_etag(self):
        load_photos()
        original_count = RosterPhoto.query.count()
        old_response = self.client.get('/api/roster-photos/allison-cheng.webp')
        record = json.loads((PHOTO_DIR / 'manifest.json').read_text())[0]
        raw = BytesIO()
        Image.new('RGB', (80, 100), 'blue').save(raw, format='PNG')
        content = compress_photo(raw.getvalue())
        record['content_hash'] = sha256(content).hexdigest()
        record['source_url'] = 'https://example.com/new-photo.jpg'
        with TemporaryDirectory() as directory:
            path = Path(directory)
            (path / (record['key'] + '.webp')).write_bytes(content)
            (path / 'manifest.json').write_text(json.dumps([record]))
            self.assertEqual(load_photos(path), 1)
        self.assertEqual(RosterPhoto.query.count(), original_count)
        response = self.client.get('/api/roster-photos/allison-cheng.webp', headers={
            'If-None-Match': old_response.headers['ETag'],
        })
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.headers['ETag'], old_response.headers['ETag'])

    def test_all_bundled_images_are_small_valid_webp_files(self):
        records = json.loads((PHOTO_DIR / 'manifest.json').read_text())
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
            image = BytesIO()
            Image.new('RGB', size, 'red').save(image, format='PNG')
            content = compress_photo(image.getvalue())
            with Image.open(BytesIO(content)) as compressed:
                self.assertLessEqual(max(compressed.size), 320)
                if size == (64, 80):
                    self.assertEqual(compressed.size, size)

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
            response = Mock(content=b'not an image')
            with patch('requests.Session.get', return_value=response):
                with self.assertRaises(SystemExit):
                    prepare([{'key': record['key'], 'sources': [{'url': 'https://example.com/new.jpg'}]}], path)
            self.assertEqual(image_path.read_bytes(), original)
            self.assertEqual(json.loads((path / 'manifest.json').read_text()), [record])


if __name__ == '__main__':
    unittest.main()
