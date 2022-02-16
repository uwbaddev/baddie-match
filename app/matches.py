from typing import final
from app import db
import json
from datetime import datetime

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
      match.last_edit = datetime.today().strftime('%Y-%m-%d-%H:%M:%S')

      return 'success', 201
  
  def delete(id):
    db.session.query(Matches).filter(Matches.id==id).delete()
    db.session.commit()

  def getMatchesWithPlayer(id):
    id = int(id)
    all_matches = Matches.query.all()
    to_return = []
    for match in all_matches:
      for playerId in match.players:
        if (playerId == id):
          to_return.append(match)
    return json.dumps([m.serialize() for m in to_return])

  def createMatch(event, players, score, category):
    # TODO: player error checking
    if ((event is None) | (score is None)):
      raise Exception('fields cannot be null')
    
    parsed_score = json.loads(score)
    if (len(parsed_score) != 6):
      raise Exception('score must be an array of 6')

    if event == "Singles":
      match=Matches (
        event = event,
        players = [players[0], players[1]],
        score = parsed_score,
        category = category,
        date_added = datetime.today(),
        last_edit = datetime.today(),
        winners = Matches.getWinner(parsed_score, players, event)
      )
      db.session.add(match)
    else:
      match=Matches (
        event = event,
        players = [players[0], players[1], players[2], players[3]],
        score = parsed_score,
        category = category,
        date_added = datetime.today(),
        last_edit = datetime.today(),
        winners = Matches.getWinner(parsed_score, players, event)
      )
      db.session.add(match)
      
    db.session.commit()
    return 'success'
  
  def getWinner(s, players, event):
    team1score = 0
    team2score = 0
    if (s[0] > s[1]):
      team1score += 1
    elif (s[0] < s[1]):
      team2score += 1  
    if (s[2] > s[3]):
      team1score += 1
    elif (s[0] < s[1]):
      team2score += 1 
    if (s[4] > s[5]):
      team1score += 1
    elif (s[0] < s[1]):
      team2score += 1

    if (event == 'Singles'):
      return [players[0]] if team1score > team2score else [players[1]]
    else:
      return [players[0], players[1]] if team1score > team2score else [players[2], players[3]]  

  def serialize(self):
    return {
        'id': self.id,
        'event': self.event,
        'players': self.players,
        'winners': self.winners,
        'score': self.score,
        'category': self.category,
        'date_added': self.date_added.strftime('%Y-%m-%d-%H:%M:%S'),
        'last_edit': self.last_edit.strftime('%Y-%m-%d-%H:%M:%S')
    }
