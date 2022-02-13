from typing import final
from app import db
import json
from datetime import date

class Matches(db.Model):
  __tablename__ = 'matches'

  id = db.Column(db.Integer, primary_key=True)
  event = db.Column(db.String())
  players = db.Column(db.ARRAY(db.Integer()))
  winners = db.Column(db.ARRAY(db.Integer()))
  score = db.Column(db.ARRAY(db.Integer()))
  category = db.Column(db.String())
  date_added = db.Column(db.Date())
  last_edit = db.Column(db.Date())

  def __repr__(self):
    return '<Matches %r>' % self.id
  
  def findById(id):
      match = Matches.query.get(id)
      if (match is None):
        return None
      else:
        return match.serialize()

  def update(id, event, players, winners, score, category):
      if (id is None):
        raise Exception('fields cannot be null')
      
      match = Matches.query.get(id)

      if (event is not None):
        match.event = event
        db.session.commit()
      if (players is not None):
        match.players = players
        db.session.commit()
      if (winners is not None):
        match.winners = winners
        db.session.commit()
      if (score is not None):
        match.score = score
        db.session.commit()
      if (category is not None):
        match.category = category
        db.session.commit()
      match.last_edit = date.today()
      return 'success', 200
  
  def delete(id):
    db.session.query(Matches).filter(Matches.id==id).delete()
    db.session.commit()

  def getMatchesWithPlayer(id):
    all_matches = Matches.query.all()
    to_return = []
    for match in all_matches:
      for playerId in match.players:
        if (playerId == id):
          to_return.append(match)
    return json.dumps([m.serialize() for m in to_return])

  def createMatch(event, player1Id, player2Id, score, category):
    if ((event is None) | (player1Id is None) | (player2Id is None) | (score is None)):
        raise Exception('fields cannot be null')
    
    parsed_score = json.loads(score)
     
    #raise Exception(final_score)
    
    match=Matches (
      event = event,
      players = [player1Id, player2Id],
      score = parsed_score,
      category = category,
      date_added = date.today(),
      last_edit = date.today(),
    )
    db.session.add(match)
    db.session.commit()
    return 'success'
  
 
      
  def serialize(self):
    return {
        'id': self.id,
        'event': self.event,
        'players': self.players,
        'winners': self.winners,
        'score': self.score,
        'category': self.category,
        'date_added': self.date_added,
        'last_edit': self.last_edit
    }
