from flask_sqlalchemy import SQLAlchemy

from app.main import app

db = SQLAlchemy(app)

class CategoryModel(db.Model):
  __tablename__ = 'categories'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String())

  def __repr__(self):
    return '<Category %r>' % self.name

  def findById(id):
      category = CategoryModel.query.get(id)
      if (category is None):
        return None
      else:
        return category.serialize()

  def delete(id):
    db.session.query(CategoryModel).filter(CategoryModel.id==id).delete()
    db.session.commit()

  def update(id, name):
      if (id is None):
        raise Exception('fields cannot be null')
      
      category = CategoryModel.query.get(id)

      if (name is not None):
        category.name = name
        db.session.commit()
      return 'success', 201

  def serialize(self):
    return {
        'id': self.id,
        'name': self.name
    }
