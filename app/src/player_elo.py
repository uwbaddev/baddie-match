from __future__ import division
import requests
import trueskill as ts
import datetime
from operator import itemgetter
import os
import pandas as pd
import json

# todo:
# need to change the schema of player model, make elo attributes a part of the schema
# refactor get_data to pull from db instead of going through web api

class Player_elo:
    def expected(A, B):
        """
        Calculate expected score of A in a match against B
        :param A: Elo rating for player A
        :param B: Elo rating for player B
        """
        return 1 / (1 + 10 ** ((B - A) / 400))


    def elo(old, exp, score, k=32):
        """
        Calculate the new Elo rating for a player
        :param old: The previous Elo rating
        :param exp: The expected score for this match
        :param score: The actual score for this match
        :param k: The k-factor for Elo (default: 32)
        """
        return old + k * (score - exp)

    def initialize_player_stat_dict(players):
        # dictionary with player id as key
        # store list of [name, singles elo rating, doubles elo rating, singles games played, singles wins, singles losses,
        # doubles games played, doubles wins, doubles losses, list of singles score deltas, list of doubles score deltas, singles elo 2] 

        player_stats = {}
        for p in players:
            player_stats[p['id']] = [p['first_name'] + ' ' + p['last_name'], ts.Rating(), ts.Rating(),0,0,0,0,0,0,[],[],1000]
        
        return (player_stats)

    def update_match(match, player_stats):
        if (match['score'][0] > 0 or match['score'][1] > 0):
            updated_stats = Player_elo.update_game(match, 0, 1, player_stats)
        
        if (match['score'][2] > 0 or match['score'][3] > 0):
            updated_stats = Player_elo.update_game(match, 2, 3, updated_stats)
            
        if (match['score'][4] > 0 or match['score'][5] > 0):
            updated_stats = Player_elo.update_game(match, 4, 5, updated_stats)
        
        return (updated_stats)

    def update_game(match, score_1_pos, score_2_pos, player_stats):
        # get deltas
        delta_t1 = match['score'][score_1_pos] - match['score'][score_2_pos]
        delta_t2 = match['score'][score_2_pos] - match['score'][score_1_pos]

        # determine winner (0 flags the winner)
        if delta_t1 > 0:
            result = [0, delta_t1]
            win_loss = [0, 1]
        else:
            result = [-delta_t1, 0]
            win_loss = [1, 0]

        # check singles or doubles
        if match['event'] != 'Singles':
            # Doubles update

            # list of elo scores for team 
            p1_elo = player_stats[match['players'][0]][2]
            p2_elo = player_stats[match['players'][1]][2]

            p3_elo = player_stats[match['players'][2]][2]
            p4_elo = player_stats[match['players'][3]][2]

            t1 = [p1_elo, p2_elo]
            t2 = [p3_elo, p4_elo]

            # new elo
            new_elo = ts.rate([t1, t2], ranks=result)

            # set new elos
            player_stats[match['players'][0]][2] = new_elo[0][0]
            player_stats[match['players'][1]][2] = new_elo[0][1]
            player_stats[match['players'][2]][2] = new_elo[1][0]
            player_stats[match['players'][3]][2] = new_elo[1][1]

            # games played
            player_stats[match['players'][0]][6] += 1
            player_stats[match['players'][1]][6] += 1
            player_stats[match['players'][2]][6] += 1
            player_stats[match['players'][3]][6] += 1

            # wins
            player_stats[match['players'][0]][7] += abs(win_loss[1])
            player_stats[match['players'][1]][7] += abs(win_loss[1])
            player_stats[match['players'][2]][7] += abs(win_loss[0])
            player_stats[match['players'][3]][7] += abs(win_loss[0])

            # losses
            player_stats[match['players'][0]][8] += abs(win_loss[0])
            player_stats[match['players'][1]][8] += abs(win_loss[0])
            player_stats[match['players'][2]][8] += abs(win_loss[1])
            player_stats[match['players'][3]][8] += abs(win_loss[1])

            # deltas
            player_stats[match['players'][0]][10].append(delta_t1)
            player_stats[match['players'][1]][10].append(delta_t1)
            player_stats[match['players'][2]][10].append(delta_t2)
            player_stats[match['players'][3]][10].append(delta_t2)

            return (player_stats)

        else:
            # Singles update

            # list of elo scores for team 
            p1_elo = player_stats[match['players'][0]][2]
            p2_elo = player_stats[match['players'][1]][2]

            t1 = [p1_elo]
            t2 = [p2_elo]

            # new elo
            new_elo = ts.rate([t1, t2], ranks=result)
            
            p1_elo2 = Player_elo.elo(player_stats[match['players'][0]][11], Player_elo.expected(player_stats[match['players'][0]][11], player_stats[match['players'][1]][11]), delta_t1/2)
            p2_elo2 = Player_elo.elo(player_stats[match['players'][1]][11], Player_elo.expected(player_stats[match['players'][1]][11], player_stats[match['players'][0]][11]), delta_t2/2)
                                                                        
            # set new elos
            player_stats[match['players'][0]][1] = new_elo[0][0]
            player_stats[match['players'][1]][1] = new_elo[1][0]

            player_stats[match['players'][0]][11] = p1_elo2
            player_stats[match['players'][1]][11] = p2_elo2
                                                                        
            # games played
            player_stats[match['players'][0]][3] += 1
            player_stats[match['players'][1]][3] += 1

            # wins
            player_stats[match['players'][0]][4] += abs(win_loss[1])
            player_stats[match['players'][1]][4] += abs(win_loss[0])

            # losses
            player_stats[match['players'][0]][5] += abs(win_loss[0])
            player_stats[match['players'][1]][5] += abs(win_loss[1])

            # deltas
            player_stats[match['players'][0]][9].append(delta_t1)
            player_stats[match['players'][1]][9].append(delta_t2)

            return (player_stats)

    def get_data(s): 
        URL = os.environ['PROD_API_URL'] + s
        request = requests.get(url = URL)

        if (request.status_code != 200):
            print("Error: " + URL + " returned status: " + str(request.status_code))
            return []

        return request.json()


    def get_df_stats(): 
        matches = Player_elo.get_data('matches')
        players = Player_elo.get_data('players')

        player_stats = Player_elo.initialize_player_stat_dict(players)
        
        # get recent matches
        matches = [match for match in matches if datetime.datetime.strptime(match['date_added'], '%Y-%m-%d-%H:%M:%S') > datetime.datetime(2022, 9, 1)]
        # get sorted matches
        matches = sorted(matches, key=itemgetter('date_added'), reverse=False)

        for m in matches:
            player_stats = Player_elo.update_match(m, player_stats)
        
        stat_columns = ['name', 'singles_rating', 'doubles_rating', 
        'singles_games_played', 'singles_wins', 'singles_losses',
        'doubles_games_played', 'doubles_wins', 'doubles_losses', 
        'singles_score_deltas', 'list_of_doubles_score_deltas', 'singles_elo']

        df_player_stats = pd.DataFrame.from_dict(player_stats, orient='index', dtype=None, columns=stat_columns)
        return df_player_stats

    def get_doubles_elo():
        df_player_stats = Player_elo.get_df_stats()
        df_doubles_ranks = df_player_stats[df_player_stats['doubles_games_played'] >= 1]
        df_doubles_ranks['doubles_win_pct'] =  df_doubles_ranks['doubles_wins']/df_doubles_ranks['doubles_games_played']
        df_doubles_ranks = df_doubles_ranks.sort_values(by=['doubles_rating'], ascending = False)
        df_doubles_ranks = df_doubles_ranks[['name', 'doubles_rating', 'doubles_games_played', 'doubles_wins', 'doubles_losses', 'doubles_win_pct']]
        return df_doubles_ranks.to_json(None, 'index'), 200

    def get_singles_elo():
        df_player_stats = Player_elo.get_df_stats()
        df_singles_ranks = df_player_stats[df_player_stats['singles_games_played'] >= 1]
        df_singles_ranks['singles_win_pct'] =  df_singles_ranks['singles_wins']/df_singles_ranks['singles_games_played']
        df_singles_ranks = df_singles_ranks.sort_values(by=['singles_elo'], ascending = False)
        df_singles_ranks =  df_singles_ranks[['name', 'singles_elo', 'singles_rating', 'singles_games_played', 'singles_wins', 'singles_losses', 'singles_win_pct']]
        return df_singles_ranks.to_json(None, 'index'), 200


if __name__ == '__main__':
    print(Player_elo.get_doubles_elo())
    print(Player_elo.get_singles_elo())
