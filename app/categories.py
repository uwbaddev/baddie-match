from unicodedata import category
from app import db

class Categories(db.Model):
  __tablename__ = 'categories'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String())

  def __repr__(self):
    return '<Category %r>' % self.name

  def findById(id):
      category = Categories.query.get(id)
      if (category is None):
        return None
      else:
        return category.serialize()

  def delete(id):
    db.session.query(Categories).filter(Categories.id==id).delete()
    db.session.commit()

  def update(id, name):
      if (id is None):
        raise Exception('fields cannot be null')
      
      category = Categories.query.get(id)

      if (name is not None):
        category.name = name
        db.session.commit()
      return 'success', 201

  def serialize(self):
    return {
        'id': self.id,
        'name': self.name
    }
