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

################################################################################
#players 
################################################################################

@cross_origin()
@app.route("/api/players", methods = ["GET"])
def getplayers():
    return Players.get_all_players(), 200


@cross_origin()
@app.route("/api/player", methods = ["POST"])
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
@app.route("/api/player/<id>", methods = ["DELETE", "GET", "PUT"])
def playerHandler(id):
    player = Players.findById(id)
    if (player is None):
        return 'No player found', 204
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


################################################################################
#categories 
################################################################################
              
@cross_origin()              
@app.route("/api/category", methods = ["POST"])
def newCategory():
    name = request.form.get("name")  
    try:
        category=Categories(
            name=name
        )
        db.session.add(category)
        db.session.commit()
        print("success!")
        
        return "Inserted {name} into categories".format(name=name), 201
    except Exception as e:
        return str(e), 500


@cross_origin()
@app.route("/api/categories", methods = ["GET"])
def getCategories():
    categories = Categories.query.all()
    return json.dumps([c.serialize() for c in categories])


@cross_origin()    
@app.route("/api/category/<id>", methods = ["GET","DELETE","PUT"])
def categoryHandler(id):
    if (request.method == 'GET'):
        category = Categories.findById(id)
        if (category is None):
            return 'No category found', 204
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
            return 'fail', 204
        Categories.delete(id)
        return "success", 200

################################################################################
#matches 
################################################################################
    
@cross_origin()
@app.route("/api/matches", methods = ["GET"])
def getMatches():
    matches = Matches.query.all()
    return json.dumps([m.serialize() for m in matches])

@cross_origin()
@app.route("/api/match/<id>", methods = ["DELETE", "GET", "PUT"])
def matchHandler(id):
    match = Matches.findById(id)
    if (match is None):
        return 'No match found', 204
    elif (request.method == 'GET'):
        return match, 200
    elif (request.method == 'PUT'):
        event = request.form.get("event")
        players = request.form.get("players")
        winners = request.form.get("winners")
        score = request.form.get("score")
        category = request.form.get("category")
        print(score)
        try:
            return Matches.update(id, event, players, winners, score, category)
        except Exception as e:
            return str(e), 500
    else:
        try:
            Matches.delete(id)
            return "success", 200
        except Exception as e:
            return str(e), 500

@cross_origin()
@app.route("/api/match/player/<id>", methods = ["GET"])
def getMatchesWithPlayer(id):
    try:
        to_return = Matches.getMatchesWithPlayer(id)
        return to_return, 200
    except Exception as e:
            return str(e), 500

@cross_origin()
@app.route("/api/match", methods = ["POST"])
def addMatch():
    event = request.form.get("event")
    player1Id = request.form.get("player1Id")
    player2Id = request.form.get("player2Id")
    player3Id = request.form.get("player3Id")
    player4Id = request.form.get("player4Id")
    score  = request.form.get("score")
    category = request.form.get("category")
    players = [player1Id, player2Id]
    if player3Id is not None:
        players.append(player3Id)
    if player4Id is not None:
        players.append(player4Id)
    
    try: 
        (Matches.createMatch(event, players, score, category))
        return 'Match was added', 200
    
    except Exception as e:
        return str(e), 500


if __name__ == '__main__':
    app.run()
