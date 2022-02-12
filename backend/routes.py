from __main__ import app, db
from categories import Categories
from players import Players
from matches import Matches
from flask import request, jsonify
import os, json

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/match", methods = ["GET"])
def get_all_matches():
    matches = Matches.query.all()
    return jsonify([e.serialize() for e in matches])

@app.route("/match/<id>")
def get_matches(id):
    match = Matches.query.filter_by(id=id).first()
    return jsonify(match.serialize())

# @app.route("match", methods = ["POST"])
# def post_match():
#     id = request.form.get("id")
#     first_name = request.form.get("first_name")
#     last_name = request.form.get("last_name")
#     elegible_year = request.form.get("elegible_year")
#     sex = request.form.get("sex")

#     matches=Matches(name=name)
#     db.session.add(category)
#     db.session.commit()
#     print("success!")
    
#     return "Inserted {name} into categories".format(name=name), 200


@app.route("/players", methods = ["GET"])
def getplayers():
    return Players.get_all_players()

@app.route("/player", methods = ["POST"])
def newPlayer():
    id = request.form.get("id")
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    elegible_year = request.form.get("elegible_year")
    sex = request.form.get("sex")
    try: 
        return(Players.createPlayer(id, first_name, last_name, elegible_year, sex))
    except Exception as e:
        return str(e)


@app.route("/category", methods = ["POST"])
def newCategory():
    name = request.form.get("name")
    print(name)
    print('postgresql://{user}:{password}@{host}/{name}'.format(
    user=os.getenv('DATABASE_USER'),
    password=os.getenv('DATABASE_PASSWORD'),
    host=os.getenv('DATABASE_HOST'),
    name=os.getenv('DATABASE_NAME')))
    
    try:
        category=Categories(name=name)
        db.session.add(category)
        db.session.commit()
        print("success!")
        
        return "Inserted {name} into categories".format(name=name), 200
    except Exception as e:
        return str(e), 500

@app.route("/categories", methods = ["GET"])
def getCategories():
    categories = Categories.query.all()
    return json.dumps([c.serialize() for c in categories])