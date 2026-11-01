from datetime import date
import json
import os
from types import SimpleNamespace
import unittest
from unittest.mock import patch

os.environ.setdefault('DATABASE_URL', 'sqlite:///:memory:')
os.environ.setdefault('APP_SETTINGS', 'config.TestingConfig')

from main import app
from src.matches import Matches
from src.players import Players
from src.player_elo import Player_elo
from src.stats import Stats


PLAYERS = [
    {'id': player_id, 'first_name': name, 'last_name': 'Test'}
    for player_id, name in [(11, 'Ada'), (22, 'Ben'), (33, 'Cyd'), (44, 'Dee'), (55, 'Eve')]
]


def match(event, players, score, day='2025-09-02-12:00:00'):
    data = {'event': event, 'players': players, 'score': score, 'date_added': day}
    return SimpleNamespace(**data, serialize=lambda: data.copy())


class StatsCalculationTests(unittest.TestCase):
    def setUp(self):
        self.matches = [
            match('Singles', [11, 22], [21, 15, 18, 21, 21, 10]),
            match('Doubles', [11, 22, 33, 44], [21, 15, 20, 22, 0, 0]),
            match('Mixed', [22, 44, 11, 33], [16, 21, 0, 0, 0, 0]),
        ]
        self.players_patch = patch.object(Players, 'get_all_players', return_value=json.dumps(PLAYERS))
        self.matches_patch = patch.object(Matches, 'getMatchesBetweenDate', side_effect=lambda *_: self.matches)
        self.players_query = self.players_patch.start()
        self.matches_query = self.matches_patch.start()
        self.addCleanup(self.players_patch.stop)
        self.addCleanup(self.matches_patch.stop)

    def results(self):
        body, status = Stats.getWinPercentages(date(2025, 9, 1), date(2026, 8, 31))
        self.assertEqual(status, 200)
        return {player['id']: player for player in json.loads(body)}

    def test_counts_every_game_for_both_teams_and_preserves_zero_game_players(self):
        rows = self.results()
        self.assertEqual(list(rows), [11, 22, 33, 44, 55])
        self.assertEqual(rows[11], {
            'id': 11, 'name': 'Ada Test', 'singles_wins': 2, 'singles_losses': 1,
            'doubles_wins': 1, 'doubles_losses': 1, 'mixed_wins': 1, 'mixed_losses': 0,
        })
        self.assertEqual(rows[22]['singles_wins'], 1)
        self.assertEqual(rows[22]['singles_losses'], 2)
        self.assertEqual(rows[33]['doubles_wins'], 1)
        self.assertEqual(rows[44]['mixed_losses'], 1)
        self.assertTrue(all(value == 0 for key, value in rows[55].items() if key.endswith(('_wins', '_losses'))))

    def test_reads_players_and_matches_once_without_querying_each_player(self):
        with patch.object(Matches, 'getMatchesWithPlayer', side_effect=AssertionError('Repeated query')):
            self.results()
        self.players_query.assert_called_once()
        self.matches_query.assert_called_once_with(date(2025, 9, 1), date(2026, 8, 31))

    def test_ignores_unplayed_games_and_keeps_existing_tied_score_behavior(self):
        self.matches = [match('Singles', [11, 22], [21, 21, 0, 0, 0, 0])]
        rows = self.results()
        self.assertEqual(rows[11]['singles_losses'], 1)
        self.assertEqual(rows[22]['singles_wins'], 1)
        self.matches = [match('Singles', [11, 22], [0, 0, 0, 0, 0, 0])]
        self.assertEqual(self.results()[11]['singles_losses'], 0)

    def test_empty_period_and_unknown_player_ids(self):
        self.matches = []
        self.assertEqual(self.results()[11]['singles_wins'], 0)
        self.matches = [match('Singles', [11, 999], [21, 10, 0, 0, 0, 0])]
        self.assertEqual(self.results()[11]['singles_wins'], 1)

    def test_recalculates_from_current_matches_after_edits_and_deletions(self):
        self.assertEqual(self.results()[11]['singles_wins'], 2)
        self.matches[0] = match('Singles', [11, 22], [10, 21, 0, 0, 0, 0])
        self.assertEqual(self.results()[11]['singles_wins'], 0)
        self.assertEqual(self.results()[11]['singles_losses'], 1)
        self.matches.pop(0)
        self.assertEqual(self.results()[11]['singles_losses'], 0)

    def test_combined_elo_matches_legacy_responses_with_one_history_replay(self):
        start, end = date(2025, 9, 1), date(2026, 8, 31)
        expected_singles = json.loads(Player_elo.get_singles_elo(start, end)[0])
        expected_doubles = json.loads(Player_elo.get_doubles_elo(start, end)[0])
        with patch.object(Player_elo, 'get_df_stats', wraps=Player_elo.get_df_stats) as replay:
            result, status = Player_elo.get_elo(start, end)
        self.assertEqual(status, 200)
        replay.assert_called_once_with(start, end)
        self.assertEqual(result, {'singles': expected_singles, 'doubles': expected_doubles})

    def test_combined_elo_route_preserves_the_requested_period(self):
        with patch.object(Player_elo, 'get_elo', return_value=({'singles': [], 'doubles': []}, 200)) as calculate:
            response = app.test_client().get('/api/elo?start=2025-09-01&end=2026-08-31')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'singles': [], 'doubles': []})
        calculate.assert_called_once_with(date(2025, 9, 1), date(2026, 8, 31))


if __name__ == '__main__':
    unittest.main()
