from __future__ import division
import trueskill as ts
from operator import itemgetter
from src.players import Players
from src.matches import Matches
import json
from flask import jsonify

# todo:
# need to change the schema of player model, make elo attributes a part of the schema

class Player_elo_v2:
    def __init__(self):
        # Create a new true skill object 
        ts_env = ts.TrueSkill()
        ts.setup(env=ts_env)
        self.ts_env = ts_env

        self.players = self.prep_players()
        
    
    def get_number_games(self, match):
        if match["score"][4] or match["score"][5] > 0:
            return 3
        elif match["score"][3] or match["score"] [2] > 0:
            return 2
        else: return 1
    
    def get_game_types(self, match):
        """
        returns array len 3 of boolean values for partial or not
        True if full, false if not
        """
        to_return = [None, None, None]
        num_games = self.get_number_games(match)
        # INSERT_YOUR_CODE
        for i in range(0, num_games):
            score_1 = match["score"][i*2]
            score_2 = match["score"][(i*2) + 1]
            to_return[i] = "Complete" if score_1 >= 21 or score_2 >= 21 else "Partial"
        
        return to_return
    
    def apply_partial_rating(self, pscore1, pscore2, team1, team2):
        # Apply some sort of partial weighting 
        # For now mark as incomplete 
        self.apply_one_game(pscore1, pscore2, team1, team2, .75)
        
    
    def apply_rating(self, match, team1, team2):
        game_types = self.get_game_types(match)
        partial_game = game_types.index("Partial") if "Partial" in game_types else None
        num_games = self.get_number_games(match)
        if partial_game is not None:
            # Partial Match detected 
            
            # Get the number of games: 
            ### !!!! BIG ASSUMPTION PARTIAL GAME iS AT THE END !!!!
            
            
            
            # Rank the partial with the partial weighting 
            partial_score1 = match["score"][(num_games - 1) * 2]
            partial_score2 = match["score"][((num_games - 1) * 2) + 1] # index super ugliness
            
            print(f" Partial {partial_score1}, {partial_score2}")
            self.apply_partial_rating(partial_score1, partial_score2, team1, team2)
            # Rank the other games(With other)
    
            # 1 Full Case (2 total)
            if num_games == 2: 
                score1 = match["score"][0]
                score2 = match["score"][1]
                self.apply_one_game(score1, score2, team1, team2)
            
            # 2 Full case (3 total)
            elif num_games == 3:
                match["score"] = match["score"][0:4] + [0, 0]
                self.apply_multi_game(match, team1, team2)
            else:
                pass
        else: 
            if num_games == 1: 
                score1 = match["score"][0]
                score2 = match["score"][1]
                self.apply_one_game(score1, score2, team1, team2)
            else: self.apply_multi_game(match, team1, team2)
        
    
    def apply_one_game(self, score1, score2, team1, team2, weight = .85):
        team1_res = 1 if score1 < score2 else 0 # lower is better
        team2_res = 1 if score2 < score1 else 0
        
        ### This is kinda hacky. But it works - it cause less change depending on the weight
        team1_weight = weight if score1 < score2 else 1
        team2_weight = weight if score2 < score1 else 1
        weights = [[team1_weight] * len(team1), [team2_weight] * len(team2)]
        
        print(weights)
        ### ====
        
        print([team1_res, team2_res])
        
        team1_rating = [self.players.get(t)["rating"] for t in team1]
        team2_rating = [self.players.get(t)["rating"] for t in team2]
        
        team1_new, team2_new = self.ts_env.rate([team1_rating, team2_rating], ranks=[team1_res, team2_res], weights=weights)
        
        
        for p_id, new_rating in zip(team1, team1_new):
            self.players[p_id]["rating"] = new_rating
            
        for p_id, new_rating in zip(team2, team2_new):
            self.players[p_id]["rating"] = new_rating
    
        
    
    def get_multi_game_ranking(self, match):
        num_games = self.get_number_games(match)
        scores = match["score"]
        
        team1_res = [1 if scores[i * 2] > scores[(i * 2) + 1] else 0 for i in range(0, num_games)]
        team2_res = [1 if scores[i * 2] < scores[(i * 2) + 1] else 0 for i in range(0, num_games)]
            
        team1_sum = sum(team1_res)
        team2_sum = sum(team2_res)
        
        if team1_sum > team2_sum: 
            return [0, 1] # lower is better here( ranking order)
        elif team2_sum > team1_sum:
            return [1, 0]
        else: return [0,0]
        
        
        
        
    
    def apply_multi_game(self, match, team1, team2):
        # return
        ranking = self.get_multi_game_ranking(match)
        
        print(str(ranking) + "--")
        
        team1_rating = [self.players.get(t)["rating"] for t in team1]
        team2_rating = [self.players.get(t)["rating"] for t in team2]
        
        team1_new, team2_new = self.ts_env.rate([team1_rating, team2_rating], ranks=ranking)
        
        if "84" in team1 or "84" in team2:
            print("hello")
        
        for p_id, new_rating in zip(team1, team1_new):
            self.players[p_id]["rating"] = new_rating
            
        for p_id, new_rating in zip(team2, team2_new):
            self.players[p_id]["rating"] = new_rating
    
        
                           
        #     # {
        #     "category": "ranked",
        #     "date_added": "2025-09-03-00:00:00",
        #     "event": "Singles",
        #     "id": 1089,
        #     "last_edit": "2025-09-03-13:08:50",
        #     "players": [
        #         57,
        #         113
        #     ],
        #     "score": [
        #         21,
        #         17,
        #         0,
        #         0,
        #         0,
        #         0
        #     ],
        #     "winners": [
        #         57
        #     ]
        # },
    
    
    def generate_singles_elo(self, start, end):
        # players not needed here; we use existing self.players prepared in __init__
        all_matches = Matches.getMatchesBetweenDate(start, end)
        
        matches = [m.serialize() for m in all_matches]
        # INSERT_YOUR_CODE
        # Convert matches["data"] to a list of matches where event is "Singles"
        matches = [m for m in matches if m.get("event") == "Singles"]
        # matches = json.loads(matches)

        # for m in m
        
        # print()
        
        matches = [m for m in matches if m.get("event") == "Singles"]
        
        # INSERT_YOUR_CODE
        matches = sorted(matches, key=itemgetter('date_added'))
        
        
        for m in matches: 
            player1 = m["players"][0]
            player2 = m["players"][1]
            
            
            
            self.apply_rating(m, [player1], [player2])
            ranking = self.get_multi_game_ranking(m)
            
            if ranking[0] == ranking[1]:
                self.players.get(player1)["singles_draws"] += 1
                self.players.get(player2)["singles_draws"] += 1
            
            elif ranking[0] == 1:
                self.players.get(player1)["singles_losses"] += 1
                self.players.get(player2)["singles_wins"] += 1
            
            else:
                self.players.get(player1)["singles_wins"] += 1
                self.players.get(player2)["singles_losses"] += 1

                
            
            # Check if it has partial matches 
            
 
        return jsonify(self.serialize())
    
    
    
    def prep_players(self):
        players = json.loads(Players.get_all_players())
        for p in players: 
            # Can add code to add seeding 
            p["rating"] = self.ts_env.create_rating()
            # ['name', 'singles_elo', 'singles_rating', 'singles_games_played', 'singles_wins', 'singles_losses', 'singles_win_pct']
            p["singles_wins"] = 0
            p["singles_losses"] = 0
            p["singles_win_pct"] = 0
            p["singles_draws"] = 0
        
        players_dict = {p["id"]: p for p in players}
        return players_dict 

    def serialize(self):
        serialized = [p for p in self.players.values() if p.get("elegible_year", 0) != -1]
        # ['name', 'singles_elo', 'singles_rating', 'singles_games_played', 'singles_wins', 'singles_losses', 'singles_win_pct']
        # print(serialized)
#         "singles_rating": {"exposure": 23.2348168872, "mu":
# 29.5454294172, "pi": 0.2259953371, "sigma": 2.10353751, "tau": 6.6771292814},

        for p in serialized:

            p["singles_rating"] = { 
                                "exposure": p["rating"].exposure, 
                                "mu": p["rating"].mu,
                                    "pi": p["rating"].pi, 
                                    "sigma": p["rating"].sigma,
                                    "tau": p["rating"].tau}
            p["rating"] = str(p["rating"])

        return serialized

    # def get_doubles_elo(self, start, end):
    #     df_player_stats = self.get_df_stats(start, end)
    #     df_doubles_ranks = df_player_stats
    #     df_doubles_ranks['doubles_win_pct'] =  df_doubles_ranks['doubles_wins']/df_doubles_ranks['doubles_games_played']
    #     df_doubles_ranks = df_doubles_ranks.sort_values(by=['doubles_rating'], ascending = False)
    #     df_doubles_ranks = df_doubles_ranks[['name', 'doubles_rating', 'doubles_games_played', 'doubles_wins', 'doubles_losses', 'doubles_win_pct']]
    #     return df_doubles_ranks.to_json(None, 'records'), 200
    
        # I need to treat the games as a match 
    
    # def serialize(self):
    #     return {"res": }
        
    
    
    
    def get_doubles_elo(self, _start, _end):
        return self.generate_doubles_elo(_start, _end)

    def generate_doubles_elo(self, _start, _end):
        # Doubles ranking not yet implemented in v2
        return jsonify([])

    def get_singles_elo(self, start, end):
        return self.generate_singles_elo("2025-09-01", "2026-09-01")
        # df_player_stats = self.get_df_stats(start, end)
        # df_singles_ranks = df_player_stats
        # df_singles_ranks['singles_win_pct'] =  df_singles_ranks['singles_wins']/df_singles_ranks['singles_games_played']
        # df_singles_ranks = df_singles_ranks.sort_values(by=['singles_elo'], ascending = False)
        # df_singles_ranks = df_singles_ranks[['name', 'singles_elo', 'singles_rating', 'singles_games_played', 'singles_wins', 'singles_losses', 'singles_win_pct']]
        # return df_singles_ranks.to_json(None, 'records'), 200
