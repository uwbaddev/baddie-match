import {
  buildEloGroups,
  buildOverallWinRankings,
  buildWinRankings,
  ELO_MAX_GROUPS,
  ELO_MIN_GROUP_SIZE,
  ELO_MIN_GROUPS,
  ELO_PLAYERS_PER_GROUP,
  formatPlayerName,
  getEloGroupCount,
  getEloPromotionSpots,
  getPlayerYearLabel,
  groupMatchesByDate,
  makeProfileEloCards,
  makeProfileStats,
  shuffle,
  summarizeMatch,
} from '../../../v2/utils/playerViewModels';

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
    expect.objectContaining({ id: 1, rank: 2, name: 'Liam Zhang', to: '/players/2025-26/id/1', winPct: 50, record: '5:5' }),
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

const eloRow = (name, mu, sigma, games, eventKey = 'singles', extra = {}) => ({
  name,
  [`${eventKey}_rating`]: { mu, sigma },
  [`${eventKey}_games_played`]: games,
  [`${eventKey}_win_pct`]: 0.5,
  ...extra,
});

// rng that always returns 0 -> deterministic shuffle
const fixedRng = () => 0;
const groupNames = result => result.groups.map(group => group.players.map(player => player.name).sort());

test('buildEloGroups hides 0-game players and splits out players still getting placed', () => {
  const result = buildEloGroups([
    eloRow('Placed A', 30, 2, 5),
    eloRow('Placed B', 29, 2, 6),
    eloRow('Placed C', 28, 2, 9),
    eloRow('Almost', 40, 2, 4),
    eloRow('Zara New', 25, 8, 1),
    eloRow('Never Played', 25, 8.33, 0),
    { name: 'No Rating', singles_games_played: 9 },
  ], 'singles', fixedRng);

  expect(groupNames(result)).toEqual([['Placed A', 'Placed B', 'Placed C']]);
  expect(result.placing.map(player => [player.name, player.games, player.placementGames])).toEqual([
    ['Almost', 4, 5],
    ['Zara New', 1, 5],
  ]);
});

test('buildEloGroups uses 8 placement games for doubles', () => {
  const result = buildEloGroups([
    eloRow('Seven', 30, 2, 7, 'doubles'),
    eloRow('Eight A', 30, 2, 8, 'doubles'),
    eloRow('Eight B', 29, 2, 8, 'doubles'),
    eloRow('Eight C', 28, 2, 8, 'doubles'),
  ], 'doubles', fixedRng);

  expect(groupNames(result)).toEqual([['Eight A', 'Eight B', 'Eight C']]);
  expect(result.placing.map(player => player.name)).toEqual(['Seven']);
});

// `count` players around `mu`, best first, with names `${prefix} 1..count`
const cluster = (prefix, mu, count, sigma = 0.5) => (
  Array.from({ length: count }, (_, index) => eloRow(`${prefix} ${index + 1}`, mu - index * 0.1, sigma, 20))
);

test('buildEloGroups orders by the cautious score so uncertain players sit lower', () => {
  // same mu, different certainty. score = mu - 2 sigma: Steady 28, Lucky 30 - 16 = 14, Low 10
  const result = buildEloGroups([
    ...cluster('Steady', 30, 4, 1),
    eloRow('Lucky', 30, 8, 5),
    ...cluster('Low', 12, 3, 1),
  ], 'singles', fixedRng);

  expect(groupNames(result)).toEqual([
    ['Steady 1', 'Steady 2', 'Steady 3', 'Steady 4'],
    ['Low 1', 'Low 2', 'Low 3', 'Lucky'],
  ]);
});

test('getEloGroupCount scales with players and respects the limits', () => {
  expect(getEloGroupCount(0)).toBe(0);
  expect(getEloGroupCount(ELO_MIN_GROUP_SIZE - 1)).toBe(1);
  expect(getEloGroupCount(ELO_MIN_GROUP_SIZE * 2)).toBe(Math.min(2, ELO_MIN_GROUPS));
  expect(getEloGroupCount(ELO_MIN_GROUP_SIZE * ELO_MIN_GROUPS)).toBe(ELO_MIN_GROUPS);
  expect(getEloGroupCount(ELO_PLAYERS_PER_GROUP * (ELO_MIN_GROUPS + 1))).toBe(Math.min(ELO_MAX_GROUPS, ELO_MIN_GROUPS + 1));
  expect(getEloGroupCount(1000)).toBe(ELO_MAX_GROUPS);
});

test('buildEloGroups splits at the natural breaks and folds a straggler into the bottom group', () => {
  const clusterCount = ELO_MIN_GROUPS + 1;
  const rows = Array.from({ length: clusterCount }, (_, index) => cluster(`C${index}`, 100 - index * 20, ELO_PLAYERS_PER_GROUP)).flat();
  // a lone player a little below the last cluster (gap 5, vs 20 between clusters)
  rows.push(eloRow('Straggler', 100 - (clusterCount - 1) * 20 - 5, 0.5, 20));

  const result = buildEloGroups(rows, 'singles', fixedRng);

  expect(result.groups).toHaveLength(clusterCount);
  expect(result.groups.map(group => group.label)).toEqual(
    Array.from({ length: clusterCount }, (_, index) => `Group ${index + 1}`)
  );
  result.groups.slice(0, -1).forEach((group, index) => {
    expect(group.players.every(player => player.name.startsWith(`C${index} `))).toBe(true);
  });
  expect(result.groups[clusterCount - 1].players.map(player => player.name)).toContain('Straggler');
  expect(result.groups.flatMap(group => group.players)).toHaveLength(rows.length);
});

test('buildEloGroups keeps several groups when ratings are tightly and evenly spread', () => {
  // late-season shape: small sigmas, no obvious gaps. Should not collapse into one or two giant groups.
  const rows = Array.from({ length: 20 }, (_, index) => eloRow(`P${index}`, 30 - index * 0.8, 1.5, 30));
  const result = buildEloGroups(rows, 'singles', fixedRng);

  expect(result.groups).toHaveLength(getEloGroupCount(20));
  result.groups.forEach(group => {
    expect(group.players.length).toBeGreaterThanOrEqual(ELO_MIN_GROUP_SIZE);
    expect(group.players.length).toBeLessThanOrEqual(20 / result.groups.length + ELO_MIN_GROUP_SIZE);
  });
});

test('getEloPromotionSpots skips the top group and scales with group size', () => {
  expect(getEloPromotionSpots(0, 8)).toBe(0);
  expect(getEloPromotionSpots(1, 5)).toBe(2);
  expect(getEloPromotionSpots(1, 4)).toBe(1);
  expect(getEloPromotionSpots(2, 3)).toBe(1);
  expect(getEloPromotionSpots(2, 2)).toBe(0);
});

test('buildEloGroups puts the highest scores of each lower group first as promotion spots', () => {
  const rows = [
    ...cluster('Top', 60, 5),
    eloRow('Mid Best', 40.4, 0.5, 20),
    eloRow('Mid Second', 40.3, 0.5, 20),
    eloRow('Mid 3', 40.2, 0.5, 20),
    eloRow('Mid 4', 40.1, 0.5, 20),
    eloRow('Mid 5', 40, 0.5, 20),
    eloRow('Low Best', 20.3, 0.5, 20),
    eloRow('Low 2', 20.2, 0.5, 20),
    eloRow('Low 3', 20.1, 0.5, 20),
    eloRow('Low 4', 20, 0.5, 20),
  ];

  const result = buildEloGroups(rows, 'singles');
  const [top, mid, low] = result.groups;

  expect(result.groups).toHaveLength(3);
  expect(top.players.every(player => !player.promotion)).toBe(true);
  expect(mid.players.slice(0, 2).map(player => player.name).sort()).toEqual(['Mid Best', 'Mid Second']);
  expect(mid.players.slice(0, 2).every(player => player.promotion)).toBe(true);
  expect(mid.players.slice(2).every(player => !player.promotion)).toBe(true);
  expect(low.players[0]).toEqual(expect.objectContaining({ name: 'Low Best', promotion: true }));
  expect(low.players.slice(1).every(player => !player.promotion)).toBe(true);
});

test('buildEloGroups gives the top group 1st, 2nd and 3rd in score order, then shuffles the rest', () => {
  const rows = [
    eloRow('Third', 60.1, 0.5, 20),
    eloRow('First', 60.3, 0.5, 20),
    eloRow('Fourth', 60.0, 0.5, 20),
    eloRow('Second', 60.2, 0.5, 20),
    eloRow('Fifth', 59.9, 0.5, 20),
    ...cluster('Mid', 40, 4),
    ...cluster('Low', 20, 4),
  ];

  const result = buildEloGroups(rows, 'singles', fixedRng);
  const [top, ...lower] = result.groups;

  expect(top.players.slice(0, 3).map(player => [player.name, player.podium])).toEqual([
    ['First', 1], ['Second', 2], ['Third', 3],
  ]);
  expect(top.players.slice(3).map(player => player.name).sort()).toEqual(['Fifth', 'Fourth']);
  expect(top.players.slice(3).every(player => player.podium === undefined)).toBe(true);
  expect(top.players.every(player => !player.promotion)).toBe(true);
  lower.forEach(group => expect(group.players.every(player => player.podium === undefined)).toBe(true));
});

test('shuffle reorders with the provided rng without losing items', () => {
  const items = [1, 2, 3, 4];
  expect(shuffle(items, () => 0)).toEqual([2, 3, 4, 1]);
  expect(shuffle(items, () => 0.999)).toEqual([1, 2, 3, 4]);
  expect(items).toEqual([1, 2, 3, 4]);
});

test('makeProfileEloCards shows the group for placed players and progress for players getting placed', () => {
  const singlesGroups = buildEloGroups([
    eloRow('Liam Zhang', 31.4, 2.8, 8, 'singles', { singles_win_pct: 0.67 }),
    eloRow('Allison Cheng', 28.1, 3.1, 8),
    eloRow('Ben Singh', 27, 3, 8),
  ], 'singles', fixedRng);
  const doublesGroups = buildEloGroups([
    eloRow('t_Liam Zhang', 27.4, 3.2, 3, 'doubles', { doubles_win_pct: 0.25 }),
  ], 'doubles', fixedRng);

  expect(makeProfileEloCards({ id: 113, name: 't_Liam Zhang' }, singlesGroups, doublesGroups)).toEqual([
    expect.objectContaining({ label: 'Singles Elo', groupLabel: 'Group 1', placing: false, promotion: false, games: 8, winPct: 67 }),
    expect.objectContaining({ label: 'Doubles Elo', groupLabel: undefined, placing: true, placementGames: 8, games: 3, winPct: 25 }),
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

test('guests are hidden from win rankings and labelled Guest', () => {
  const stats = [
    { id: 1, name: 'Team Player', is_guest: false, singles_wins: 8, singles_losses: 0 },
    { id: 2, name: 'Guest Player', is_guest: true, singles_wins: 9, singles_losses: 0 },
  ];

  expect(buildWinRankings(stats, 'singles').map(row => row.id)).toEqual([1]);
  expect(buildOverallWinRankings(stats).map(row => row.id)).toEqual([1]);
  expect(getPlayerYearLabel({ elegible_year: -2, is_guest: true })).toBe('Guest');
});
