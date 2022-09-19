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
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    eligible_year = int(request.json.get("eligibleYear"))
    sex = request.json.get("sex")
    try: 
        (Players.createPlayer(first_name, last_name, eligible_year, sex))
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
        first_name = request.json.get("first_name")
        last_name = request.json.get("last_name")
        elegible_year = request.json.get("elegible_year")
        sex = request.json.get("sex")
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
    name = request.json.get("name")
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
        player_results = []
        players = json.loads(Players.get_all_players())
        for p in players:
            matches = json.loads(Matches.getMatchesWithPlayer(p["id"]))
            d_win, s_win, m_win = 0, 0, 0
            d_loss, s_loss, m_loss = 0, 0, 0
            
            for m in matches:
                if m.event == "Doubles":
                    if p["id"] in m.winners:
                        d_win += 1
                    else:
                        d_loss += 1
                elif m.event == "Mixed":
                    if p["id"] in m.winners:
                        m_win += 1
                    else:
                        m_loss += 1
                else:
                    if p["id"] in m.winners:
                        s_win += 1
                    else:
                        s_loss +=1

            player_results.append({
                "singles_wins": s_win,
                "singles_losses": s_loss,
                "doubles_wins": d_win,
                "doubkes_loses": d_loss,
                "mixed_wins": m_win,
                "mixed_losses": m_loss,
            })

        return json.dumps(player_results), 200
    except Exception as e:
            return str(e), 500

if __name__ == '__main__':
    app.run()
