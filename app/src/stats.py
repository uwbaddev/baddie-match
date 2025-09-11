from src.players import Players
from src.matches import Matches
import json

class Stats:
    def getWinPercentages(start, end):
        player_results = []
        players = json.loads(Players.get_all_players())
        for p in players:
            matches = json.loads(Matches.getMatchesWithPlayer(p["id"], start, end))
            d_win, s_win, m_win = 0, 0, 0
            d_loss, s_loss, m_loss = 0, 0, 0

            for m in matches:
                is_team_1 = (m["players"][0] == p["id"]) if (m["event"] == 'Singles') else (m["players"][0] == p["id"] or m["players"][1] == p["id"])
                
                wins, losses = 0, 0
                for i in range(3):
                    first = i * 2
                    second = i * 2 + 1
                    if m["score"][first] == 0 and m["score"][second] == 0: continue
                    if is_team_1:
                        if m["score"][first] > m["score"][second]:
                            wins += 1 
                        else:
                            losses += 1
                    else:
                        if m["score"][first] > m["score"][second]:
                            losses += 1 
                        else:
                            wins += 1

                if m["event"] == "Doubles":
                    d_win += wins
                    d_loss += losses
                elif m["event"] == "Mixed":
                    m_win += wins
                    m_loss += losses
                else:
                    s_win += wins
                    s_loss += losses

            player_results.append({
                "id": p["id"], 
                "name": p["first_name"] + " " + p["last_name"],
                "singles_wins": s_win,
                "singles_losses": s_loss,
                "doubles_wins": d_win,
                "doubles_losses": d_loss,
                "mixed_wins": m_win,
                "mixed_losses": m_loss,
            })
        return json.dumps(player_results), 200

