from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://{user}:{password}@{host}/{name}'.format(
    user=os.getenv('DATABASE_USER'),
    password=os.getenv('DATABASE_PASSWORD'),
    host=os.getenv('DATABASE_HOST'),
    name=os.getenv('DATABASE_NAME'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Categories(db.Model):
  __tablename__ = 'categories'

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String())

  def __repr__(self):
    return '<Category %r>' % self.name

  def serialize(self):
    return {
        'id': self.id,
        'name': self.name
    }

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/category", methods = ["POST"])
def newCategory():
    name = request.form.get("name")
    print(name)
    
    try:
        category=Categories(
            name=name
        )
        db.session.add(category)
        db.session.commit()
        print("success!")
        
        return "success!"
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run()
