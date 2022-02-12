from app import db

class Categories(db.Model):
  __tablename__ = 'categories'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String())

  def __repr__(self):
    return '<Category %r>' % self.name

  def serialize(self):
    return {
        'id': self.id,
        'name': self.name
    }
