import requests 
from app.main import app
from app.matches import Matches
import os
from dotenv import load_dotenv

load_dotenv()

URL = os.environ['PROD_API_URL'] + "matches"

request = requests.get(url = URL)

if (request.status_code != 200):
    print("Error: " + URL + " returned status: " + request.status_code)
    exit

response = request.json()
print(response)

#createMatch(event, playersInMatch, score, category)
with app.app_context():
    for match in response:
        print(
            "adding Match: " 
            + match['event'] + " " 
            + match['players'] + " "
            + match['score'] + " "
            + match['category'] + " " )

        Matches.createMatch(
            match['event'],
            match['players'], 
            match['score'],
            match['category'])
    
    