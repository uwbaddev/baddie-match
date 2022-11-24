import requests 
from app.main import app
import os
import sys
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

load_dotenv()
db = SQLAlchemy(app)

db.create_all()
db.session.commit()