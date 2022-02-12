# baddie-match
Web app to track our badminton matches

https://www.figma.com/file/cMTxu6tnGFqgTrjF2QLrtN/Untitled?node-id=0%3A1

### Running Front End Locally
```
cd front-end
npm-install
npm start
```

### Running Locally
#### PostgreSQL
Will need postgreSQL, so download that first.

Mac
```
brew install postgresql
pg_ctl -D /usr/local/var/postgres/ start
createdb <name>
psql <name>
```
(Not sure about Windows)

#### Setting up the environment variables
Make a copy of `.env.sample` and rename it to `.env` in the `back-end` directory. Set the database host, name, user name, and password to whatever is set for your db.
Run `scripts/createTables.py` to create the required tables.

#### Running the app
Mac/Linux
```
cd back-end
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
FLASK_APP=app.py flask run
```
Windows
```
cd back-end
venv\scripts\pip.exe install -r requirements.txt
venv\scripts\activate
setx FLASK_APP "app.py"
flask run
```

TODO:
* setting up postgres
* Things we will need `npm` `python3` `postgres`
