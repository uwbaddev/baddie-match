from app.src.categories import Categories
from app.src.players import Players
from app.src.matches import Matches
from app.src.stats import Stats
from app.src.player_elo import Player_elo
from app.schema.schema import *
from flask import request, jsonify, render_template
from flask_cors import cross_origin
import json
from app.main import db, app
from marshmallow.exceptions import ValidationError


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
def get_players():
    return Players.get_all_players(), 200


@cross_origin()
@app.route("/api/player", methods = ["POST"])
def new_player():
    return create(PlayerSchema, request)
    # schema = PlayerSchema()
    # result = schema.loads(request.get_data())
    # db.session.add(result)
    # db.session.commit()

@cross_origin()
@app.route("/api/player/<id>", methods = ["DELETE", "GET", "PUT"])
def player_handler(id):
    player = Players.findById(id)

    if (player is None):
        return 'No player found', 204

    elif (request.method == 'GET'):
        return player, 200

    elif (request.method == 'PUT'):
        schema = PlayerSchema()
        result = schema.loads(request.get_data())
        result.id = id 
        db.session.merge(result)
        db.session.commit()
        return result.serialize(), 200
    else:
        Players.delete(id)
        return "success", 200


################################################################################
#categories 
################################################################################
              
@cross_origin()              
@app.route("/api/category", methods = ["POST"])
def new_category():
    schema = CategorySchema()
    result = schema.loads(request.get_data())
    db.session.add(result)
    db.session.commit()
    return result.serialize(), 200


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
        name = request.json.get("name")
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
    app.logger.debug('This endpoint was hit!')
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
        event = request.json.get("event")
        score = request.json.get("score")
        category = request.json.get("category")
        players = [request.json.get("player1Id"), request.json.get("player2Id")]

        if (event != "Singles"):
            players.append(request.json.get("player3Id"))
            players.append(request.json.get("player4Id"))

        try:
            Matches.update(id, event, players, score, category)
            return 'success', 201

        except Exception as e:
            db.session.rollback()
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
    try: 
        event = request.json.get("event")
        score  = request.json.get("score")
        category = request.json.get("category")
        players = [request.json.get("player1Id"), request.json.get("player2Id")]

        if (event != "Singles"):
            players.append(request.json.get("player3Id"))
            players.append(request.json.get("player4Id"))

        (Matches.createMatch(event, players, score, category))
        return 'Match was added', 200    
    
    except Exception as e:
        return str(e), 500

################################################################################
# Player stats
################################################################################
@cross_origin()
@app.route("/api/players/stats", methods = ["GET"])
def getAllWinPercentages():
    try:
        return(Stats.getWinPercentages())
    except Exception as e:
        return str(e), 500

################################################################################
# ELO
################################################################################
@cross_origin()
@app.route("/api/elo/singles", methods = ["GET"])
def getSinglesElo():
    try:
        return(Player_elo.get_singles_elo())
    except Exception as e:
        return str(e), 500

@cross_origin()
@app.route("/api/elo/doubles", methods = ["GET"])
def getDoublesElo():
    try:
        return(Player_elo.get_doubles_elo())
    except Exception as e:
        return str(e), 500


@app.errorhandler(ValidationError)
def handle_validation_error(e):
    return e.normalized_messages(), 400


# to be moved into a controller/utils file directory in the future

# used for base create, throws validation error and possibly db errors 
def create(schema, request):
    schema = schema()
    result = schema.loads(request.get_data())
    db.session.add(result)
    db.session.commit()
    return result.serialize(), 200

if __name__ == '__main__':
    app.run()
