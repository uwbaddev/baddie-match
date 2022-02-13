from app import db
import json
from sqlalchemy import delete, update, insert

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
      if ((id is None) | (first_name is None) | (last_name is None) | (elegible_year is None) | (sex is None)):
        raise Exception('fields cannot be null')

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

    def findById(id):
      player = Players.query.get(id)
      if (player is None):
        return None
      else:
        return player.serialize()
    
    def update(id, first_name, last_name, elegible_year, sex):
      if (id is None):
        raise Exception('fields cannot be null')
      
      player = Players.query.get(id)

      if (first_name is not None):
        player.first_name = first_name
        db.session.commit()
      if (last_name is not None):
        player.last_name = last_name
        db.session.commit()
      if (elegible_year is not None):
        player.elegible_year = elegible_year
        db.session.commit()
      if (sex is not None):
        player.sex = sex
        db.session.commit()
      return 'success', 200
    
    def delete(id):
      db.session.query(Players).filter(Players.id==id).delete()
      db.session.commit()
    
    def __repr__(self):
        return 'todo'

    def serialize(self):
      # if ((id is None) | (first_name is None) | (last_name is None) | (elegible_year is None) | (sex is None)):
      #   return None
      return {
          'id' : self.id,
          'first_name' : self.first_name,
          'last_name': self.last_name,
          'elegible_year' : self.elegible_year,
          'sex' : self.sex
        }


