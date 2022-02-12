from app import db

class Matches(db.Model):
  __tablename__ = 'matches'

  id = db.Column(db.Integer, primary_key=True)
  event = db.Column(db.String())
  players = db.Column(db.ARRAY(db.Integer()))
  winners = db.Column(db.ARRAY(db.Integer()))
  score = db.Column(db.ARRAY(db.Integer()))
  category = db.Column(db.String())
  date_added = db.Column(db.Date())
  last_edit = db.Column(db.Date())

  def __repr__(self):
    return '<Matches %r>' % self.id

  def serialize(self):
    return {
        'id': self.id,
        'event': self.event,
        'players': self.players,
        'winners': self.winners,
        'score': self.score,
        'category': self.category,
        'date_added': self.date_added,
        'last_edit': self.last_edit
    }
