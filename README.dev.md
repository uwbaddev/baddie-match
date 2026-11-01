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

# For mac
gunicorn -b 0.0.0.0:5000 main:app
```

### Cached roster photos

Roster photos are compressed WebP files (at most 320px on either side). Every
season uses the newest available photo for that person, including name aliases.
The original URLs in the roster data are import sources only; visitors load
photos from our API, with browser caching and ETag revalidation.

Import the bundled photos once into your local database before starting the API:

```bash
cd app
../.venv/bin/python -m scripts.load_roster_photos
```

The import creates only the `roster_photos` table and updates changed photos.
It does not recreate player/match tables. Production's `gunicorn.sh` runs this
idempotent import before starting Gunicorn, so a normal deployment includes the
photo backfill without downloading from Waterloo at startup. The prepared image
files are committed as seed assets; PostgreSQL stores and serves the image bytes.
Keep these assets in the deployment image. Normal browser cache lifetime is one
day; refreshed photos become visible after expiry or a browser reload with cache
disabled. Players without an available photo retain initials.

To prepare photos after changing the source URLs in the roster data, from the
repo root (Node 16.20.2 or newer):

```bash
uv pip install -r app/requirements-photo-tools.txt
node front-end/scripts/roster-photo-sources.mjs | .venv/bin/python -m app.scripts.prepare_roster_photos
```

This command downloads each changed person's newest available source, falls back
to older sources if needed, strips image metadata, and compresses it. Review and
commit the updated files under `app/data/roster_photos/`, then rerun the import.
It never runs as part of a website request. Existing photos survive a failed
refresh. Stats still come from our existing Flask/database endpoints.

Photo checks (the backend tests use an isolated in-memory SQLite database):

```bash
cd app
../.venv/bin/python -m unittest discover -s tests -v
```

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

