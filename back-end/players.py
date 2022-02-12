from app import db
import json

class Players(db.Model):
    #todo find out how to make non-nullable
    __tablename__ = 'players'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    elegible_year = db.Column(db.Integer)
    sex = db.Column(db.String)

    def get_all_players():
      players = Players.query.all()
      print('hi')
      return json.dumps([player.serialize() for player in players])
    
    def createPlayer(first_name, last_name, elegible_year, sex): 
      # if ((id is None) | (first_name is None) | (last_name is None) | (elegible_year is None) | (sex is None)):
      #   raise Exception('fields cannot be null')

      player=Players(
            first_name=first_name,
            last_name=last_name,
            elegible_year=elegible_year,
            sex=sex,
        )
      db.session.add(player)
      db.session.commit()
      print("success!")
      return "success!"


    
    def __repr__(self):
        return 'todo'

    def serialize(self):
        return {
            'id' : self.id,
            'first_name' : self.first_name,
            'last_name': self.last_name,
            'elegible_year' : self.elegible_year,
            'sex' : self.sex
        }


