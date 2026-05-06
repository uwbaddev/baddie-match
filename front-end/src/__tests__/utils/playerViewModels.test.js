import {
  buildEloRankings,
  buildOverallWinRankings,
  buildWinRankings,
  formatPlayerName,
  getPlayerYearLabel,
  groupMatchesByDate,
  makeProfileEloCards,
  makeProfileStats,
  summarizeMatch,
} from '../../utils/playerViewModels';

const players = [
  { id: 1, first_name: 'Ada', last_name: 'Wong', elegible_year: 0 },
  { id: 2, first_name: 'Ben', last_name: 'Singh', elegible_year: 1 },
  { id: 3, first_name: 'Cyd', last_name: 'Tran', elegible_year: 2 },
  { id: 4, first_name: 'Dee', last_name: 'Kim', elegible_year: 3 },
];

test('buildWinRankings sorts by event win percentage and includes win-loss text', () => {
  const rankings = buildWinRankings([
    { id: 1, name: 't_Liam Zhang', singles_wins: 5, singles_losses: 5 },
    { id: 2, name: 'Ben Singh', singles_wins: 7, singles_losses: 2 },
    { id: 3, name: 'Cyd Tran', singles_wins: 0, singles_losses: 0 },
  ], 'singles');

  expect(rankings).toEqual([
    expect.objectContaining({ id: 2, rank: 1, name: 'Ben Singh', winPct: 78, record: '7:2' }),
    expect.objectContaining({ id: 1, rank: 2, name: 'Liam Zhang', to: '/players/2025-26/liam-zhang', winPct: 50, record: '5:5' }),
  ]);
});

test('buildWinRankings excludes players with fewer than eight event games', () => {
  const rankings = buildWinRankings([
    { id: 1, name: 'Qualified Player', singles_wins: 5, singles_losses: 3 },
    { id: 2, name: 'Low Sample Player', singles_wins: 7, singles_losses: 0 },
  ], 'singles');

  expect(rankings).toEqual([
    expect.objectContaining({ id: 1, rank: 1, name: 'Qualified Player', record: '5:3' }),
  ]);
});

test('buildOverallWinRankings excludes players with fewer than eight total games', () => {
  const rankings = buildOverallWinRankings([
    { id: 1, name: 'Qualified Player', singles_wins: 2, singles_losses: 2, doubles_wins: 2, doubles_losses: 2, mixed_wins: 0, mixed_losses: 0 },
    { id: 2, name: 'Low Sample Player', singles_wins: 6, singles_losses: 1, doubles_wins: 0, doubles_losses: 0, mixed_wins: 0, mixed_losses: 0 },
  ]);

  expect(rankings).toEqual([
    expect.objectContaining({ id: 1, rank: 1, name: 'Qualified Player', record: '4:4' }),
  ]);
});

test('formats player display fields from existing API data', () => {
  expect(formatPlayerName(players[0])).toBe('Ada Wong');
  expect(getPlayerYearLabel(players[0])).toBe('First Year');
  expect(getPlayerYearLabel(players[3])).toBe('Fourth Year');
  expect(getPlayerYearLabel({ elegible_year: 10 })).toBe('Player');
});

test('summarizeMatch resolves players, scores, categories, and winners', () => {
  const summary = summarizeMatch({
    id: 10,
    event: 'Doubles',
    category: 'Ranked',
    players: [1, 2, 3, 4],
    winners: [3, 4],
    score: [15, 21, 18, 21, 0, 0],
    last_edit: '2025-09-19-07:00:00',
  }, players);

  expect(summary.time).toBe('7:00 AM');
  expect(summary.dateTimeLabel).toBe('Fri Sep 19, 2025 · 7:00 AM');
  expect(summary.teamOne).toBe('Ada Wong / Ben Singh');
  expect(summary.teamTwo).toBe('Cyd Tran / Dee Kim');
  expect(summary.teamOnePlayers).toEqual([
    { id: 1, name: 'Ada Wong', to: '/players/1' },
    { id: 2, name: 'Ben Singh', to: '/players/2' },
  ]);
  expect(summary.teamTwoPlayers).toEqual([
    { id: 3, name: 'Cyd Tran', to: '/players/3' },
    { id: 4, name: 'Dee Kim', to: '/players/4' },
  ]);
  expect(summary.teamTwoWon).toBe(true);
  expect(summary.sets).toEqual([
    { teamOne: 15, teamTwo: 21 },
    { teamOne: 18, teamTwo: 21 },
  ]);
  expect(summary.winningSide).toBe('teamTwo');
});

test('makeProfileStats ranks win-rate stats by id and normalized names', () => {
  const stats = [
    { id: 1, name: 't_Liam Zhang', singles_wins: 5, singles_losses: 4, doubles_wins: 6, doubles_losses: 3, mixed_wins: 4, mixed_losses: 4 },
    { id: 2, name: 'Allison Cheng', singles_wins: 8, singles_losses: 1, doubles_wins: 5, doubles_losses: 3, mixed_wins: 5, mixed_losses: 3 },
    { id: 3, name: 'Ben Singh', singles_wins: 2, singles_losses: 6, doubles_wins: 4, doubles_losses: 4, mixed_wins: 2, mixed_losses: 6 },
  ];

  expect(makeProfileStats(stats[0], stats)).toEqual([
    expect.objectContaining({ label: 'SINGLES', rank: 2, wins: 5, losses: 4, winPct: 56 }),
    expect.objectContaining({ label: 'DOUBLES', rank: 1, wins: 6, losses: 3, winPct: 67 }),
    expect.objectContaining({ label: 'MIXED', rank: 2, wins: 4, losses: 4, winPct: 50 }),
    expect.objectContaining({ label: 'OVERALL', rank: 2, wins: 15, losses: 11, winPct: 58 }),
  ]);
});

test('makeProfileStats keeps own win-rate stats while omitting rank below threshold', () => {
  const stats = [
    { id: 1, name: 't_Liam Zhang', singles_wins: 4, singles_losses: 1, doubles_wins: 1, doubles_losses: 1, mixed_wins: 0, mixed_losses: 1 },
    { id: 2, name: 'Allison Cheng', singles_wins: 8, singles_losses: 1, doubles_wins: 5, doubles_losses: 3, mixed_wins: 5, mixed_losses: 3 },
  ];

  expect(makeProfileStats(stats[0], stats)).toEqual([
    expect.objectContaining({ label: 'SINGLES', rank: undefined, wins: 4, losses: 1, winPct: 80 }),
    expect.objectContaining({ label: 'DOUBLES', rank: undefined, wins: 1, losses: 1, winPct: 50 }),
    expect.objectContaining({ label: 'MIXED', rank: undefined, wins: 0, losses: 1, winPct: 0 }),
    expect.objectContaining({ label: 'OVERALL', rank: 2, wins: 5, losses: 3, winPct: 63 }),
  ]);
});

test('makeProfileEloCards resolves seeded player names to compact elo cards', () => {
  const singlesRankings = buildEloRankings([
    {
      name: 'Liam Zhang',
      singles_elo: 1042,
      singles_rating: { mu: 31.4, sigma: 2.8 },
      singles_games_played: 8,
      singles_win_pct: 0.67,
    },
    {
      name: 'Allison Cheng',
      singles_elo: 1000,
      singles_rating: { mu: 28.1, sigma: 3.1 },
      singles_games_played: 8,
      singles_win_pct: 0.5,
    },
  ], 'singles');
  const doublesRankings = buildEloRankings([
    {
      name: 'Allison Cheng',
      doubles_rating: { mu: 29.2, sigma: 2.7 },
      doubles_games_played: 8,
      doubles_win_pct: 0.5,
    },
    {
      name: 'Liam Zhang',
      doubles_rating: { mu: 27.4, sigma: 3.2 },
      doubles_games_played: 8,
      doubles_win_pct: 0.25,
    },
  ], 'doubles');

  expect(makeProfileEloCards({ id: 113, name: 't_Liam Zhang' }, singlesRankings, doublesRankings)).toEqual([
    expect.objectContaining({ label: 'Singles Elo', rank: 1, mu: 31.4, sigma: 2.8, games: 8, winPct: 67 }),
    expect.objectContaining({ label: 'Doubles Elo', rank: 2, mu: 27.4, sigma: 3.2, games: 8, winPct: 25 }),
  ]);
});

test('buildEloRankings excludes players with fewer than eight games or high sigma', () => {
  const rankings = buildEloRankings([
    {
      name: 'Qualified Player',
      singles_rating: { mu: 30, sigma: 3.9 },
      singles_games_played: 8,
      singles_win_pct: 0.75,
    },
    {
      name: 'Low Sample Player',
      singles_rating: { mu: 40, sigma: 2 },
      singles_games_played: 7,
      singles_win_pct: 1,
    },
    {
      name: 'High Variance Player',
      singles_rating: { mu: 35, sigma: 4 },
      singles_games_played: 12,
      singles_win_pct: 0.8,
    },
  ], 'singles');

  expect(rankings).toEqual([
    expect.objectContaining({ rank: 1, name: 'Qualified Player', games: 8, sigma: 3.9 }),
  ]);
});

test('summarizeMatch selects winner by total points when set wins are tied', () => {
  const summary = summarizeMatch({
    id: 11,
    event: 'Singles',
    category: 'Practice',
    players: [1, 2],
    score: [21, 19, 18, 21, 21, 20],
    last_edit: '2025-09-19-07:00:00',
  }, players);

  expect(summary.winningSide).toBe('teamOne');
});

test('summarizeMatch leaves winningSide empty when sets and total points are tied', () => {
  const summary = summarizeMatch({
    id: 12,
    event: 'Singles',
    category: 'Practice',
    players: [1, 2],
    score: [21, 19, 19, 21, 0, 0],
    last_edit: '2025-09-19-07:00:00',
  }, players);

  expect(summary.winningSide).toBeNull();
});

test('groupMatchesByDate returns newest date sections first', () => {
  const groups = groupMatchesByDate([
    { id: 1, last_edit: '2025-09-18-08:00:00' },
    { id: 2, last_edit: '2025-09-19-07:00:00' },
  ]);

  expect(groups.map(group => group.label)).toEqual(['FRI SEP 19, 2025', 'THU SEP 18, 2025']);
});
