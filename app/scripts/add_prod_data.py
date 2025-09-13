import requests
from main import app
from src.players import Players
from src.matches import Matches
from src.categories import Categories
import os
import sys
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

load_dotenv()
db = SQLAlchemy(app)


def add_players():
    URL = os.environ['PROD_API_URL'] + "players"
    request = requests.get(url=URL)

    if (request.status_code != 200):
        print("Error: " + URL + " returned status: " + str(request.status_code))
        exit(1)

    response = request.json()

    players_added = 0

    for player in response:
        print("queuing player: " +
              player['first_name'] + " " + player['last_name'])
        player = Players(
            id=player['id'],
            first_name="t_" + player['first_name'],
            last_name=player['last_name'],
            elegible_year=player['elegible_year'],
            sex=player['sex'],
        )
        db.session.add(player)
        players_added += 1
    try:
        db.session.commit()
        print("added players: " + str(players_added))
        print("expected players: " + str(len(response)))
    except Exception as e:
        db.session.rollback()
        print(e)
        print(" error, no rows added")
        exit(1)


def add_matches():
    URL = os.environ['PROD_API_URL'] + "matches/all"
    request = requests.get(url=URL)

    if (request.status_code != 200):
        print("Error: " + URL + " returned status: " + str(request.status_code))
        exit(1)

    response = request.json()

    matches_added = 0

    for match in response:
        #print("queuing match: " + str(match['id']))
        match = Matches(
            id=match['id'],
            event=match['event'],
            players=match['players'],
            winners=match['winners'],
            category=match['category'],
            score=match['score'],
            date_added=datetime.strptime(
                match['date_added'], '%Y-%m-%d-%H:%M:%S'),
            last_edit=datetime.strptime(
                match['last_edit'], '%Y-%m-%d-%H:%M:%S'),
        )
        db.session.add(match)
        matches_added += 1
    try:
        db.session.commit()
        print("added matches: " + str(matches_added))
        print("expected matches: " + str(len(response)))
    except Exception as e:
        db.session.rollback()
        print(e)
        print(" error, no rows added")
        exit(1)


def add_categories():
    URL = os.environ['PROD_API_URL'] + "categories"
    request = requests.get(url=URL)

    if (request.status_code != 200):
        print("Error: " + URL + " returned status: " + str(request.status_code))
        exit(1)

    response = request.json()

    categories_added = 0

    for cat in response:
        print("queuing category id: " + str(cat['id']) + " " + cat['name'])
        cat = Categories(
            id=cat['id'],
            name="t_" + cat['name'],
        )
        db.session.add(cat)
        categories_added += 1
    try:
        db.session.commit()
        print("added categories: " + str(categories_added))
        print("expected categories: " + str(len(response)))
    except Exception as e:
        db.session.rollback()
        print(e)
        print(" error, no rows added")
        exit(1)


if __name__ == "__main__":
    if len(sys.argv) == 1:
        print("adding everything")
        add_players()
        add_categories()
        add_matches()
    elif sys.argv[1] == 'm':
        print("adding matches")
        add_matches()
    elif sys.argv[1] == 'p':
        print("adding players")
        add_players()
    elif sys.argv[1] == 'c':
        print("adding categories")
        add_categories()
    else:
        print("please use no command line args or m, p, or c")
        exit(1)
