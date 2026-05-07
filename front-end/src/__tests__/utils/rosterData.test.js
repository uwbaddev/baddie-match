import {
  findLatestRosterRecordForLocalPlayer,
  findLatestRosterRecord,
  findLocalPlayerForRoster,
  findRosterRecordForLocalPlayer,
  findRosterPlayer,
  getLocalPlayerRosterProfilePath,
  getRosterCardProfilePath,
  getRosterProfilePath,
  getRosterAvatar,
  getRosterBySeason,
  getRosterPlayerAvatar,
  normalizeRosterName,
  ROSTER_SEASONS,
} from '../../utils/rosterData';

test('exposes roster seasons from 2025-26 through 2022-23', () => {
  expect(ROSTER_SEASONS.map(season => season.value)).toEqual([
    '2025-26',
    '2024-25',
    '2023-24',
    '2022-23',
  ]);
});

test('filters roster data by selected season', () => {
  const roster = getRosterBySeason('2024-25');

  expect(roster.players.map(player => player.name)).toContain('Allison Cheng');
  expect(roster.players.map(player => player.name)).toContain('Ivan Cheng');
  expect(roster.players.map(player => player.name)).not.toContain('Liam Zhang');
});

test('includes requested 2025-26 coaches and support staff', () => {
  const roster = getRosterBySeason('2025-26');

  expect(roster.coaches).toEqual(expect.arrayContaining([
    expect.objectContaining({ name: 'Andrew Zhuang', title: 'Head Coach', slug: 'andrew-zhuang' }),
    expect.objectContaining({ name: 'Ivan Cheng', title: 'Assistant Coach', slug: 'ivan-cheng' }),
    expect.objectContaining({ name: 'Thomas Dent', title: 'Assistant Coach', slug: 'thomas-dent' }),
    expect.objectContaining({ name: 'Brad Enns', title: 'Assistant Coach', slug: 'brad-enns' }),
  ]));
  expect(roster.supportStaff).toEqual(expect.arrayContaining([
    expect.objectContaining({ name: 'Teresa Trinh', title: 'Team Manager', slug: 'teresa-trinh' }),
    expect.objectContaining({ name: 'Mathura Murugesan', title: 'Team Manager', slug: 'mathura-murugesan' }),
    expect.objectContaining({ name: 'Alexis Boyd', title: 'Student Athletic Therapist', slug: 'alexis-boyd' }),
    expect.objectContaining({ name: 'Genah Nieto', title: 'Student Athletic Therapist', slug: 'genah-nieto' }),
    expect.objectContaining({ name: 'Matt Anderson', title: 'Student Athletic Therapist', slug: 'matt-anderson' }),
  ]));
});

test('normalizes seeded local names for roster matching', () => {
  expect(normalizeRosterName('t_Liam  Zhang')).toBe('liam zhang');
  expect(normalizeRosterName('Maggie (Man Yan) Wong')).toBe('maggie wong');
  expect(normalizeRosterName('Jun Yu (Tom) Guo')).toBe('jun yu guo');
});

test('matches official roster names to local seeded player records', () => {
  const localPlayers = [
    { id: 113, first_name: 't_Liam ', last_name: 'Zhang' },
    { id: 58, first_name: 't_Maggie', last_name: 'Wong' },
  ];

  expect(findLocalPlayerForRoster({ name: 'Liam Zhang' }, localPlayers).id).toBe(113);
  expect(findLocalPlayerForRoster({ name: 'Maggie (Man Yan) Wong' }, localPlayers).id).toBe(58);
});

test('maps local seeded player records to latest official roster profiles', () => {
  const latest = findLatestRosterRecordForLocalPlayer({
    id: 113,
    first_name: 't_Liam',
    last_name: 'Zhang',
  });

  expect(latest).toEqual(expect.objectContaining({
    name: 'Liam Zhang',
    season: '2025-26',
    slug: 'liam-zhang',
  }));
  expect(getRosterProfilePath(latest)).toBe('/v2/players/2025-26/liam-zhang');
  expect(getLocalPlayerRosterProfilePath({ id: 113, first_name: 't_Liam', last_name: 'Zhang' })).toBe('/v2/players/2025-26/id/113');
});

test('maps local stat records to 2025-26 coach profiles when names match', () => {
  const latest = findLatestRosterRecordForLocalPlayer({
    id: 39,
    first_name: 't_Ivan',
    last_name: 'Cheng',
  });

  expect(latest).toEqual(expect.objectContaining({
    name: 'Ivan Cheng',
    season: '2025-26',
    slug: 'ivan-cheng',
    title: 'Assistant Coach',
  }));
  expect(getRosterProfilePath(latest)).toBe('/v2/players/2025-26/ivan-cheng');
  expect(getLocalPlayerRosterProfilePath({ id: 39, first_name: 't_Ivan', last_name: 'Cheng' })).toBe('/v2/players/2025-26/id/39');
});

test('builds season-specific database-id roster card profile paths when local records match', () => {
  const localPlayers = [
    { id: 113, first_name: 't_Liam', last_name: 'Zhang' },
    { id: 1, first_name: 'Allison', last_name: 'Cheng' },
  ];
  const allison2024 = getRosterBySeason('2024-25').players.find(player => player.name === 'Allison Cheng');
  const liam2025 = getRosterBySeason('2025-26').players.find(player => player.name === 'Liam Zhang');

  expect(findRosterRecordForLocalPlayer('2024-25', localPlayers[1])).toEqual(allison2024);
  expect(getRosterCardProfilePath(allison2024, localPlayers)).toBe('/v2/players/2024-25/id/1');
  expect(getRosterCardProfilePath(liam2025, localPlayers)).toBe('/v2/players/2025-26/id/113');
});

test('falls back to slug roster card paths when no local database player matches', () => {
  const liam2025 = getRosterBySeason('2025-26').players.find(player => player.name === 'Liam Zhang');

  expect(getRosterCardProfilePath(liam2025, [])).toBe('/v2/players/2025-26/liam-zhang');
});

test('keeps same-name local records on distinct database-id profile paths', () => {
  const sameNamePlayers = [
    { id: 901, first_name: 'Liam', last_name: 'Zhang' },
    { id: 902, first_name: 'Liam', last_name: 'Zhang' },
  ];

  expect(getLocalPlayerRosterProfilePath(sameNamePlayers[0])).toBe('/v2/players/2025-26/id/901');
  expect(getLocalPlayerRosterProfilePath(sameNamePlayers[1])).toBe('/v2/players/2025-26/id/902');
});

test('does not create profile routes for support staff records', () => {
  expect(findRosterPlayer('2025-26', 'teresa-trinh')).toBeUndefined();
  expect(getRosterProfilePath(getRosterBySeason('2025-26').supportStaff[0])).toBeUndefined();
});

test('does not map local records to support staff profiles', () => {
  const latest = findLatestRosterRecordForLocalPlayer({
    id: 375,
    first_name: 't_Teresa',
    last_name: 'Trinh',
  });

  expect(latest).toBeUndefined();
});

test('uses official roster photo before generated avatar fallback', () => {
  expect(getRosterAvatar({ photoUrl: 'https://example.com/player.jpg' })).toEqual({
    type: 'image',
    src: 'https://example.com/player.jpg',
  });
  expect(getRosterAvatar({ name: 'Liam Zhang' })).toEqual({
    type: 'initials',
    initials: 'LZ',
  });
});

test('finds the latest roster record for the same player across seasons', () => {
  const latest = findLatestRosterRecord(getRosterBySeason('2024-25').players.find(player => player.name === 'Allison Cheng'));

  expect(latest.season).toBe('2025-26');
  expect(latest.photoUrl).toContain('2026/3/4/Allison_Cheng_DxO.jpg');
});

test('chooses latest official photo across seasons for roster avatars', () => {
  const olderAllison = getRosterBySeason('2024-25').players.find(player => player.name === 'Allison Cheng');
  const jerry = getRosterBySeason('2025-26').players.find(player => player.name === 'Jerry Yin');

  expect(getRosterPlayerAvatar(olderAllison)).toEqual({
    type: 'image',
    src: expect.stringContaining('2026/3/4/Allison_Cheng_DxO.jpg'),
  });
  expect(getRosterPlayerAvatar(jerry)).toEqual({
    type: 'initials',
    initials: 'JY',
  });
});
