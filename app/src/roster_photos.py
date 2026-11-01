from datetime import datetime
from main import db


class RosterPhoto(db.Model):
    __tablename__ = 'roster_photos'

    key = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    source_url = db.Column(db.Text, nullable=False)
    source_season = db.Column(db.String(20), nullable=False)
    content = db.Column(db.LargeBinary, nullable=False)
    content_hash = db.Column(db.String(64), nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
