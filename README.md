# 🏸 baddie-match

💻 [Website](https://baddie-match.herokuapp.com/) | ✍️ [Design](https://www.figma.com/file/cMTxu6tnGFqgTrjF2QLrtN/Untitled?node-id=0%3A1) | 📝 [Brainstorm Doc](https://docs.google.com/document/d/1A5pw-I7XXs6muCWZoTlrFCgsVgHOLn6HExxoHoQ8-58/edit?usp=sharing)

Score and stats tracker for the Waterloo Warriors badminton team.

## Developing

### Frontend

The frontend is built using [React.js](https://reactjs.org/). You will need [npm](https://www.npmjs.com/) to get started. After downloading, you can get the frontend server working locally by running:
```
cd front-end
npm install
npm start
```
**Note:** The frontend queries the production backend APIs and data. To change this, you must edit the `DomainName` in [`API.js`](https://github.com/angelamchen/baddie-match/blob/main/front-end/src/API/API.js) to point to your local server (usually `https://localhost:5000`)

### Backend
#### 1. PostgreSQL
Our application uses [PostgreSQL](https://www.postgresql.org/) to store the backend data. Setting up the database can be done as follows:

**Mac**
```
brew install postgresql
pg_ctl -D /usr/local/var/postgres/ start
createdb <name>
psql <name>
```

**Windows**
```
Download postgresql from https://www.postgresql.org/
Run installation, with all defaults
Open psql command line, from start menu
CREATE DATABASE <name>;
```

#### 2. Setting up the environment variables
To ensure that the applicattion reads from the database correctly, you will need to set up environment variables. Make a copy of `.env.sample` and rename it to `.env` in the root directory. Set the database to the <name> you just created. Then run `scripts/createTables.py` to create the required tables. For now, you will need to populate the data manually.

#### 3. Running the backend server
  
The backend is created using [Flask](https://flask.palletsprojects.com/en/2.0.x/). You will need [Python3](https://www.python.org/downloads/) to get started. Afterwards, the application can be run as follows:
  
**Mac**
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
FLASK_APP=app.main flask run
```
**Windows**
```
python3 -m venv venv
venv\scripts\activate
venv\scripts\pip.exe install -r requirements.txt
setx FLASK_APP "app.main"
flask run
```
