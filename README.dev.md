## Dev Environment Setup

This project has three parts:
- Backend (`app`): Flask API
- Frontend (`front-end`): React app
- Database: PostgreSQL (via Docker Compose using `docker-dev.yml`)

### Prerequisites
- Docker Desktop (with Docker Compose)
- Python 3.10.x or 3.11.x recommended (use 3.10.13 to match pinned deps)
  - Note: Using Python 3.13.x will fail with the pinned packages (e.g., `pandas==1.5.1`).
- Node.js 16.x (for `react-scripts`)

Recommended installers on macOS:
- Python via `pyenv`: `brew install pyenv && pyenv install 3.10.13 && pyenv local 3.10.13`
- Node via `nvm`: install nvm, then `nvm install 16 && nvm use 16`

### 1) Start the database (Docker Compose)
From the repo root:

```bash
docker compose -f docker-dev.yml up -d
```

Details:
- Postgres runs on `localhost:5800` with user `postgres`/`postgres`
- Data volume is created at `./db`

### 2) Backend (Flask API)
From the repo root, create and activate a virtual environment
```bash
python3 -m venv .venv
source .venv/bin/activate
```

Then, cd into app and install dependencies. 
```bash
cd app
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create your backend environment file from the sample:

```bash
cp .env_app.sample .env
```

Initialize the database schema and optionally seed with data (run from app dir):

```bash
python -m scripts.createTables
# Optional: pull sample/prod data into local (safe names)
python -m scripts.add_prod_data
```

Start the backend:

```bash
# For Windows:
waitress-serve --host=0.0.0.0 --port=5000 myapp:app

# For mac/linux (local): --reload restarts workers when Python files change
gunicorn -b 0.0.0.0:5000 --reload --reload-engine=poll main:app
```

### Static roster photos

Roster photos are compressed WebP files (at most 320px on either side). Every
season uses the newest available photo for that person, including name aliases.
The files live in `front-end/src/assets/roster-photos/` and ship with the frontend.
The original URLs in the roster data are download sources only; visitors never
fetch headshots from Waterloo or a photo API. No photo database table or import
is needed. An existing local `roster_photos` table is unused and can be left alone.

The frontend build produces content-hashed image URLs under `/static/media/`.
Production serves them with a one-year immutable browser cache; changing an image
changes its URL on the next build. The development server handles the same assets
automatically. Players without an available photo retain initials.

To prepare photos after changing the source URLs in the roster data, from the
repo root (Node 16.20.2 or newer):

```bash
uv pip install -r app/requirements-photo-tools.txt
node front-end/scripts/roster-photo-sources.mjs | .venv/bin/python -m app.scripts.prepare_roster_photos
```

This command downloads each changed person's newest available source, falls back
to older sources if needed, strips image metadata, and compresses it. Review and
commit the updated files under `front-end/src/assets/roster-photos/`, then rebuild
and deploy the frontend. It never runs as part of a website request. Existing
photos survive a failed refresh. Stats still come from our existing
Flask/database endpoints.

The API will be available at `http://localhost:5000` and the API root at `http://localhost:5000/api`.

### 3) Frontend (React)
Open a new terminal window. From the repo root:

```bash
cd front-end
npm install
```

Then create a copy of the environment file (in front-end dir)
```bash
cp .env_app.sample .env
```

Start the server
```bash
npm run start
```

The React dev server runs on `http://localhost:3000` and points to the local backend via `REACT_APP_DOMAIN_NAME`.

### Quickstart (copy/paste)
```bash
# 0) (One-time) Ensure versions
# Python 3.10.13 (pyenv) and Node 16 (nvm) recommended

# 1) DB
docker compose -f docker-dev.yml up -d

# 2) Backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
cd app
pip install -r /requirements.txt
cp .env_app.sample .env
python -m scripts.createTables

# 3) Frontend
cd front-end
cp .env_app.sample .env
npm install
npm start
```

### Troubleshooting
- Pip build errors on macOS ARM (Apple Silicon): use Python 3.10.x as above to pick up prebuilt wheels for `pandas==1.5.1` and `psycopg2`.
- Port conflicts: ensure `5800` (Postgres), `5000` (API), and `3000` (React dev server) are free.
- If DB init fails, verify `docker compose ps`, then rerun `python -m app.scripts.createTables`.

