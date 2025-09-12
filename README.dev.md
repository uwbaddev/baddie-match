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
From the repo root, create and activate a virtual environment, then install deps:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r app/requirements.txt
```

Create your backend environment file from the sample:

```bash
cp app/.env_app.sample app/.env
```

Ensure `DATABASE_URL` in `app/.env` points at Docker Postgres (default):
```
postgresql://postgres:postgres@localhost:5800/postgres
```

Initialize the database schema and optionally seed with data (run from repo root):

```bash
python -m app.scripts.createTables
# Optional: pull sample/prod data into local (safe names)
python -m app.scripts.add_prod_data
```

Run the backend in dev:

```bash
export FLASK_APP=app.main
flask run --port 5000
```

The API will be available at `http://localhost:5000` and the API root at `http://localhost:5000/api`.

### 3) Frontend (React)
From the repo root:

```bash
cd front-end
echo "REACT_APP_DOMAIN_NAME=http://localhost:5000/api" > .env
npm install
npm start
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
pip install -r app/requirements.txt
cp app/.env_app.sample app/.env
python -m app.scripts.createTables

# 3) Frontend
cd front-end
npm install
npm start
```

### Troubleshooting
- Pip build errors on macOS ARM (Apple Silicon): use Python 3.10.x as above to pick up prebuilt wheels for `pandas==1.5.1` and `psycopg2`.
- Port conflicts: ensure `5800` (Postgres), `5000` (API), and `3000` (React dev server) are free.
- If DB init fails, verify `docker compose ps`, then rerun `python -m app.scripts.createTables`.

