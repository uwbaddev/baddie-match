from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv


print(os.path.abspath(os.path.dirname(__file__)))
print(os.getcwd())

load_dotenv()

app = Flask(__name__, static_url_path='/',
                  static_folder="../build",
                  template_folder="../build")
CORS(app)


app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app import routes

if __name__ == "__main__":
    app.run()