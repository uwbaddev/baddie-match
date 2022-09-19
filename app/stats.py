import players as Players
import matches as Matches
import json

def getWinPercentages():
    player_results = []
    players = Players.get_all_players()
    for p in players:
        matches = Matches.getMatchesWithPlayer(p.id)
        d_win, s_win, m_win = 0, 0, 0
        d_loss, s_loss, m_loss = 0, 0, 0
        
        for m in matches:
            if m.event == "Doubles":
                if p.id in m.winners:
                    d_win += 1
                else:
                    d_loss += 1
            elif m.event == "Mixed":
                if p.id in m.winners:
                    m_win += 1
                else:
                    m_loss += 1
            else:
                if p.id in m.winners:
                    s_win += 1
                else:
                    s_loss +=1

        player_results.append({
            "singles_wins": s_win,
            "singles_losses": s_loss,
            "doubles_wins": d_win,
            "doubkes_loses": d_loss,
            "mixed_wins": m_win,
            "mixed_losses": m_loss,
        })

    return json.dumps(player_results)
