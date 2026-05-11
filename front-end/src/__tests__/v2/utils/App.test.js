import { buildWinRankings } from '../../../v2/utils/playerViewModels';

test('builds landing page ranking rows', () => {
  const rows = buildWinRankings([
    { id: 1, name: 'Player One', singles_wins: 4, singles_losses: 4 },
  ], 'singles');

  expect(rows[0]).toEqual(expect.objectContaining({
    rank: 1,
    name: 'Player One',
    winPct: 50,
    record: '4:4',
  }));
});
