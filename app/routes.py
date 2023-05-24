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
    return get_all(Players)

@cross_origin()
@app.route("/api/player", methods = ["POST"])
def new_player():
    return create(PlayerSchema, request)

@cross_origin()
@app.route("/api/player/<id>", methods = ["DELETE", "GET", "PUT"])
def player_handler(id):
    return model_handler(id, request, Players, PlayerSchema)


################################################################################
#categories 
################################################################################
              
@cross_origin()              
@app.route("/api/category", methods = ["POST"])
def new_category():
    return create(CategorySchema, request)

@cross_origin()
@app.route("/api/categories", methods = ["GET"])
def get_categories():
    return get_all(Categories)

@cross_origin()    
@app.route("/api/category/<id>", methods = ["GET","DELETE","PUT"])
def categor_handler(id):
    return model_handler(id, request, Categories, CategorySchema)

################################################################################
#matches 
################################################################################
    
@cross_origin()
@app.route("/api/matches", methods = ["GET"])
def get_matches():
    app.logger.debug('This endpoint was hit!')
    return get_all(Matches)

@cross_origin()
@app.route("/api/match/<id>", methods = ["DELETE", "GET", "PUT"])
def match_handler(id):
    return model_handler(id, request, Matches, MatchSchema)

@cross_origin()
@app.route("/api/match", methods = ["POST"])
def addMatch():
    return create(MatchSchema, request)

@cross_origin()
@app.route("/api/match/player/<id>", methods = ["GET"])
def getMatchesWithPlayer(id):
    try:
        to_return = Matches.getMatchesWithPlayer(id)
        return to_return, 200
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


###########################################################################
# Error handling: to be moved to standalone in the future, with custom exceptions 
###########################################################################

@app.errorhandler(ValidationError)
def handle_validation_error(e):
    return e.normalized_messages(), 400

###########################################################################
# to be moved into a controller/utils file directory in the future
# these methods can live of a base controller/util/model class eventually
###########################################################################

# used for base create, throws validation error and possibly db errors :)
def create(schema, request, update = False, id = None):
    schema = schema()
    result = schema.loads(request.get_data())

    if update and id: 
        result.id = id
        db.session.merge(result)

    else: 
        db.session.add(result)

    db.session.commit()
    return result.serialize(), 200

# used for getting all 
def get_all(model):
    models = model.query.all()
    return json.dumps([m.serialize() for m in models]), 200


# replaces old handlers
def model_handler(id, request, model, schema):
    obj = model.query.get(id)
    
    if (model is None): return 'Not found', 404
    
    if (request.method == 'GET'): 
        return obj, 200

    elif (request.method == 'PUT'): 
        return create(schema, request, 1, id)
    
    elif (request.method == 'DELETE'):
        db.session.query(model).filter(model.id==id).delete()
        db.session.commit()
        return 'success', 200
  

if __name__ == '__main__':
    app.run()
