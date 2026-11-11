from src.players import Players
from src.matches import Matches
import json

class Stats:
    def getWinPercentages(start, end):
        players = json.loads(Players.get_all_players())
        player_results = {
            p['id']: {
                "id": p["id"], 
                "name": p["first_name"] + " " + p["last_name"],
                "is_guest": p["is_guest"],
                "singles_wins": 0,
                "singles_losses": 0,
                "doubles_wins": 0,
                "doubles_losses": 0,
                "mixed_wins": 0,
                "mixed_losses": 0,
            } for p in players
        }
        for match in Matches.getMatchesBetweenDate(start, end):
            event = {'Doubles': 'doubles', 'Mixed': 'mixed'}.get(match.event, 'singles')
            team_one = match.players[:1] if match.event == 'Singles' else match.players[:2]
            team_one_wins, team_two_wins = 0, 0
            for index in range(0, 6, 2):
                first, second = match.score[index:index + 2]
                if first == 0 and second == 0:
                    continue
                if first > second:
                    team_one_wins += 1
                else:
                    team_two_wins += 1
            for player_id in match.players:
                result = player_results.get(player_id)
                if result is None:
                    continue
                wins, losses = (team_one_wins, team_two_wins) if player_id in team_one else (team_two_wins, team_one_wins)
                result[event + '_wins'] += wins
                result[event + '_losses'] += losses
        return json.dumps(list(player_results.values())), 200

