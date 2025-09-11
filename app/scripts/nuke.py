from main import app
from src.players import Players
from src.matches import Matches
from src.categories import Categories
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import sys


# deletes tuples from local db
# python3 scripts/nuke.py
# run with no args to clean entire db
# run with m for matches, p for players, and c for categories 

load_dotenv()
db = SQLAlchemy(app)

def nuke_players():
    try:
        num_rows_deleted = db.session.query(Players).delete()
        db.session.commit()
        print(str(num_rows_deleted) + " rows deleted from players db")
    except Exception as e:
        db.session.rollback()
        print(e)
        print(" error in deleting players, no rows deleted")
        exit(1)

def nuke_matches():
    try:
        num_rows_deleted = db.session.query(Matches).delete()
        db.session.commit()
        print(str(num_rows_deleted) + " rows deleted from matches db")
    except Exception as e:
        db.session.rollback()
        print(e)
        print(" error in deleting matches, no rows deleted")
        exit(1)

def nuke_categories():
    try:
        num_rows_deleted = db.session.query(Categories).delete()
        db.session.commit()
        print(str(num_rows_deleted) + " rows deleted from categories db")
    except Exception as e:
        db.session.rollback()
        print(e)
        print(" error in deleting Categories, no rows deleted")
        exit(1)


if __name__ == "__main__":
    if len(sys.argv) == 1:
        print("nuking everything")
        nuke_players()
        nuke_categories()
        nuke_matches()
    elif sys.argv[1] == 'm':
        print("nuking matches")
        nuke_matches()
    elif sys.argv[1] == 'p':
        print("nuking players")
        nuke_players()
    elif sys.argv[1] == 'c':
        print("nuking categories")
        nuke_categories()
    else:
        print("please use no command line args or m, p, or c")
        exit(1)
