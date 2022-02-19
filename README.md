# baddie-match
Web app to track our badminton matches

https://baddie-match.herokuapp.com/

https://www.figma.com/file/cMTxu6tnGFqgTrjF2QLrtN/Untitled?node-id=0%3A1

### Running Front End Locally
```
cd front-end
npm-install
npm start
```

### Running Locally
#### PostgreSQL
You will need postgreSQL, so download that first.

Mac
```
brew install postgresql
pg_ctl -D /usr/local/var/postgres/ start
createdb <name>
psql <name>
```

Windows
```
Download postgresql from https://www.postgresql.org/
Run installation, with all defaults
Open psql command line, from start menu
CREATE DATABASE <name>;
```

#### Setting up the environment variables
Make a copy of `.env.sample` and rename it to `.env` in the root directory. Set the database to the <name> you just created.
Run `scripts/createTables.py` to create the required tables. For now, you will need to populate the data manually.

#### Running the app
Mac/Linux
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
FLASK_APP=app.py flask run
```
Windows
```
python3 -m venv venv
venv\scripts\activate
venv\scripts\pip.exe install -r requirements.txt
setx FLASK_APP "app.py"
flask run
```

TODO:
* setting up postgres
* Things we will need `npm` `python3` `postgres`
