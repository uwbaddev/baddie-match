#!/bin/sh
set -e
python -m scripts.load_roster_photos
exec gunicorn main:app -b 0.0.0.0:$PORT
