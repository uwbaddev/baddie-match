from app import app, db
from app.categories import Categories
from app.players import Players
from app.matches import Matches
from flask import request, jsonify, render_template
from flask_cors import cross_origin
import os, json

@cross_origin()
@app.route("/")
def serve():
    print(app.static_folder)
    return render_template("index.html")

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@cross_origin()
@app.route("/players", methods = ["GET"])
def getplayers():
    return Players.get_all_players()


@cross_origin()
@app.route("/player", methods = ["POST"])
def newPlayer():
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    elegible_year = request.form.get("elegible_year")
    sex = request.form.get("sex")
    try: 
        (Players.createPlayer(first_name, last_name, elegible_year, sex))
        return 'Player ' + first_name + ' ' + last_name + ' was added.', 200
    
    except Exception as e:
        return str(e), 500


@cross_origin()
@app.route("/player/<id>", methods = ["DELETE", "GET", "PUT"])
def playerHandler(id):
    player = Players.findById(id)
    if (player is None):
        return 'No player found', 100
    elif (request.method == 'GET'):
        return player, 200
    elif (request.method == 'PUT'):
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        elegible_year = request.form.get("elegible_year")
        sex = request.form.get("sex")
        try:
            return Players.update(id, first_name, last_name, elegible_year, sex)
        except Exception as e:
            return str(e), 500
    else:
        Players.delete(id)
        return "success", 200

              
@cross_origin()              
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
        category=Categories(
            name=name
        )
        db.session.add(category)
        db.session.commit()
        print("success!")
        
        return "Inserted {name} into categories".format(name=name), 200
    except Exception as e:
        return str(e), 500


@cross_origin()
@app.route("/categories", methods = ["GET"])
def getCategories():
    categories = Categories.query.all()
    return json.dumps([c.serialize() for c in categories])


@cross_origin()    
@app.route("/category/<id>", methods = ["GET","DELETE","PUT"])
def getCategory(id):
    if (request.method == 'GET'):
        category = Categories.findById(id)
        if (category is None):
            return 'No category found', 100
        else:
            return category, 200
    elif (request.method == 'PUT'):
        name = request.form.get("name")
        try:
            return Categories.update(id, name)
        except Exception as e:
            return str(e), 500


    else: 
        if (Categories.findById(id) is None):
            return 'fail', 100
        Categories.delete(id)
        return "success", 200
    

if __name__ == '__main__':
    app.run()
