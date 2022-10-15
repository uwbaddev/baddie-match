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
  date_added = db.Column(db.TIMESTAMP())
  last_edit = db.Column(db.TIMESTAMP())


  def __repr__(self):
    return '<Matches %r>' % self.id
  

  def findById(id):
      match = Matches.query.get(id)
      if (match is None):
        return None
      else:
        return match.serialize()


  def update(id, event, players, score, category):
      if (id is None):
        raise Exception('id cannot be null')
      
      match = Matches.query.get(id)

      if (event is not None):
        Matches.validateEvent(event)
        match.event = event

      if (not all(player is None for player in players)):
        Matches.validatePlayers(players)
        match.players = players

      if (score is not None):
        Matches.validateScore(score)
        match.score = score
        match.winner = Matches.getWinner(score, players, event)

      if (category is not None):
        match.category = category

      match.last_edit = datetime.today()

      Matches.validatePlayersAndEvents(match.players, match.event)

      db.session.commit()
  

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


  def createMatch(event, playersInMatch, score, category):
    Matches.validateEvent(event)
    Matches.validateScore(score)
    Matches.validatePlayersAndEvents(playersInMatch, event)
    Matches.validatePlayers(playersInMatch)

    match=Matches (
      event = event,
      players=[playersInMatch[0], playersInMatch[1]] if event == 'Singles' else playersInMatch,
      score = score,
      category = category,
      date_added = datetime.today(),
      last_edit = datetime.today(),
      winners = Matches.getWinner(score, playersInMatch, event)
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
    elif (s[2] < s[3]):
      team2score += 1 
    if (s[4] > s[5]):
      team1score += 1
    elif (s[4] < s[5]):
      team2score += 1

    if team1score == team2score:
      team1_totalscore = s[0] + s[2]
      team2_totalscore = s[1] + s[3]
      diff = team1_totalscore - team2_totalscore

      # If score diff is 0, then we the winner is None (draw)
      if diff == 0:
        return None
      if diff > 0:
        team1score = 999
      else:
        team2score = 999

    if (event == 'Singles'):
      return [players[0]] if team1score > team2score else [players[1]]
    else:
      return [players[0], players[1]] if team1score > team2score else [players[2], players[3]]  
  
  def validatePlayers(players):
    if (len(players) != len(set(players))):
      raise Exception('players contain duplicates, received: ' + ", ".join(map(str,players)))

  def validateEvent(event):
    if event is None:
      raise Exception('event cannot be null')
    if not ((event == 'Doubles') | (event == 'Singles') | (event == 'Mixed')):
      raise Exception('event must be Doubles or Singles. Recieved: ' + event)

  def validateScore(score):
    if score is None: 
      raise Exception('score cannot be null')
    if (len(score) != 6):
      raise Exception('score must be an array of 6')

  def validatePlayersAndEvents(players, event):
    if (players[0] is None):
      raise Exception('player1Id cannot be null')
    if (players[1] is None):
      raise Exception('player2Id cannot be null')

    if (event == 'Singles'):
      if (len(players) != 2):
        raise Exception('event Singles must have 2 players.')

    if (event == 'Doubles'):
      if (len(players) != 4):
        raise Exception('event Doubles must have 4 players.')
      if (players[2] is None): 
        raise Exception('player3Id cannot be null')
      if (players[3] is None):
        raise Exception('player4Id cannot be null')


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
