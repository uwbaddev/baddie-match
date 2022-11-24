#!/bin/sh
gunicorn --chdir app app:app -b 0.0.0.0:5000