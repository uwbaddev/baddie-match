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
      if category is None:
        raise Exception(f"Category with {id} Not Found")
      else:
        return category

  def delete(id):
    CategoryModel.findById(id)
    db.session.query(CategoryModel).filter(CategoryModel.id==id).delete()
    db.session.commit()

  def update(id, name):
      category = CategoryModel.findById(id)
      category.name = name
      db.session.commit()

  def serialize(self):
    return {
        'id': self.id,
        'name': self.name
    }
