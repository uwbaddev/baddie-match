"""Create the photo table and import prepared WebP files without fetching remote sites."""
from datetime import datetime
from hashlib import sha256
import json
from pathlib import Path

from main import app, db
from src.roster_photos import RosterPhoto


PHOTO_DIR = Path(__file__).resolve().parents[1] / 'data' / 'roster_photos'


def load_photos(directory=PHOTO_DIR):
    manifest = json.loads((directory / 'manifest.json').read_text())
    # Validate the whole bundle before changing the database.
    contents = {}
    for record in manifest:
        content = (directory / (record['key'] + '.webp')).read_bytes()
        if sha256(content).hexdigest() != record['content_hash']:
            raise ValueError('Photo checksum mismatch: ' + record['key'])
        contents[record['key']] = content
    RosterPhoto.__table__.create(db.engine, checkfirst=True)
    changed = 0
    try:
        for record in manifest:
            photo = RosterPhoto.query.get(record['key'])
            if photo is not None and photo.content_hash == record['content_hash'] and photo.source_url == record['source_url']:
                continue
            if photo is None:
                photo = RosterPhoto(key=record['key'])
                db.session.add(photo)
            photo.name = record['name']
            photo.source_url = record['source_url']
            photo.source_season = record['source_season']
            photo.content = contents[record['key']]
            photo.content_hash = record['content_hash']
            photo.updated_at = datetime.utcnow()
            changed += 1
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
    return changed


if __name__ == '__main__':
    with app.app_context():
        print(f'Imported {load_photos()} new/updated roster photos')
