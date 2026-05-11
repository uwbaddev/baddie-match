import Moment from 'moment';
import {
  getLocalPlayerRosterProfilePath,
} from './rosterData';

export const EVENT_TABS = [
  { key: 'singles', label: 'Singles' },
  { key: 'doubles', label: 'Doubles' },
  { key: 'mixed', label: 'Mixed' },
];

export const EVENT_FILTERS = [
  { key: 'all', label: 'All Events' },
  ...EVENT_TABS,
];

export const SEASON_OPTIONS = [
  { label: '2025 - 2026', value: '2025-09-01,2026-08-31' },
  { label: '2023 - 2024', value: '2023-09-01,2024-08-31' },
  { label: '2022 - 2023', value: '2022-09-01,2023-08-31' },
  { label: '2021 - 2022', value: '2021-09-01,2022-08-31' },
  { label: 'ALL', value: '2000-09-01,3000-09-01' },
];

const YEAR_LABELS = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
const AVATAR_THEMES = ['avatar-a', 'avatar-b', 'avatar-c', 'avatar-d'];
export const MIN_RANKING_GAMES = 8;
export const MAX_ELO_SIGMA = 4;

export function parseSeasonValue(value) {
  const [start, end] = value.split(',');
  return { start, end };
}

export function formatPlayerName(player) {
  if (!player) return 'Player Name';
  const firstName = player.first_name || '';
  const lastName = player.last_name || '';
  const name = `${firstName} ${lastName}`.trim();
  return cleanSeedPrefix(name || player.name || 'Player Name');
}

export function cleanSeedPrefix(name) {
  return (name || '').replace(/^t_/i, '').replace(/\s+/g, ' ').trim();
}

export function getPlayerYearLabel(player) {
  const index = Number(player && player.elegible_year);
  return YEAR_LABELS[index] || 'Player';
}

export function getAvatarTheme(player, index = 0) {
  const seedValue = player && (player.id || player.slug || player.name);
  const seed = Number.isFinite(Number(seedValue))
    ? Number(seedValue)
    : String(seedValue || index)
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_THEMES[Math.abs(seed) % AVATAR_THEMES.length];
}

export function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'BM';
}

export function normalizePlayerName(name) {
  return (name || '')
    .replace(/^t_/i, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function getPlayerProfilePath(player) {
  return getLocalPlayerRosterProfilePath(player);
}

export function findPlayerByName(players, name) {
  const normalizedName = normalizePlayerName(name);
  if (!normalizedName) return undefined;
  return (players || []).find(player => normalizePlayerName(formatPlayerName(player)) === normalizedName);
}

export function buildWinRankings(stats, eventKey) {
  const winsKey = `${eventKey}_wins`;
  const lossesKey = `${eventKey}_losses`;

  return [...(stats || [])]
    .map(player => {
      const wins = Number(player[winsKey] || 0);
      const losses = Number(player[lossesKey] || 0);
      const total = wins + losses;
      const winPct = total > 0 ? Math.round((wins / total) * 100) : 0;
      return {
        id: player.id,
        to: getPlayerProfilePath(player),
        name: cleanSeedPrefix(player.name || formatPlayerName(player)),
        wins,
        losses,
        winPct,
        record: `${wins}:${losses}`,
      };
    })
    .filter(player => player.wins + player.losses >= MIN_RANKING_GAMES)
    .sort((a, b) => b.winPct - a.winPct || b.wins - a.wins || a.name.localeCompare(b.name))
    .map((player, index) => ({ ...player, rank: index + 1 }));
}

export function buildOverallWinRankings(stats) {
  return [...(stats || [])]
    .map(player => {
      const wins = Number(player.singles_wins || 0) + Number(player.doubles_wins || 0) + Number(player.mixed_wins || 0);
      const losses = Number(player.singles_losses || 0) + Number(player.doubles_losses || 0) + Number(player.mixed_losses || 0);
      const total = wins + losses;
      return {
        id: player.id,
        to: getPlayerProfilePath(player),
        name: cleanSeedPrefix(player.name || formatPlayerName(player)),
        wins,
        losses,
        winPct: total > 0 ? Math.round((wins / total) * 100) : 0,
        record: `${wins}:${losses}`,
      };
    })
    .filter(player => player.wins + player.losses >= MIN_RANKING_GAMES)
    .sort((a, b) => b.winPct - a.winPct || b.wins - a.wins || a.name.localeCompare(b.name))
    .map((player, index) => ({ ...player, rank: index + 1 }));
}

export function buildEloRankings(elo, eventKey) {
  const ratingKey = eventKey === 'singles' ? 'singles_rating' : 'doubles_rating';
  const winPctKey = eventKey === 'singles' ? 'singles_win_pct' : 'doubles_win_pct';
  const gamesKey = eventKey === 'singles' ? 'singles_games_played' : 'doubles_games_played';

  return [...(elo || [])]
    .map(player => {
      const rating = player[ratingKey] || {};
      const winPct = Number.isFinite(player[winPctKey]) ? Math.round(player[winPctKey] * 100) : 0;
      const sigma = Number(rating.sigma || 0);
      return {
        id: player.id,
        to: getPlayerProfilePath(player),
        name: cleanSeedPrefix(player.name || 'Player Name'),
        mu: Number(rating.mu || player.singles_elo || 0),
        sigma,
        winPct,
        games: Number(player[gamesKey] || 0),
      };
    })
    .filter(player => player.games >= MIN_RANKING_GAMES && player.sigma < MAX_ELO_SIGMA)
    .sort((a, b) => b.mu - a.mu || a.name.localeCompare(b.name))
    .map((player, index) => ({ ...player, rank: index + 1 }));
}

export function findPlayer(players, id) {
  return (players || []).find(player => Number(player.id) === Number(id));
}

function makeMatchPlayer(id, players) {
  const player = findPlayer(players, id);
  const name = formatPlayerName(player);
  return {
    id,
    name,
    to: getPlayerProfilePath(player),
  };
}

function formatTeam(players) {
  return players.map(player => player.name).join(' / ');
}

function summarizeWinner(sets) {
  const totals = sets.reduce((summary, set) => {
    const teamOneScore = Number(set.teamOne || 0);
    const teamTwoScore = Number(set.teamTwo || 0);
    return {
      teamOneSetWins: summary.teamOneSetWins + (teamOneScore > teamTwoScore ? 1 : 0),
      teamTwoSetWins: summary.teamTwoSetWins + (teamTwoScore > teamOneScore ? 1 : 0),
      teamOneTotalPoints: summary.teamOneTotalPoints + teamOneScore,
      teamTwoTotalPoints: summary.teamTwoTotalPoints + teamTwoScore,
    };
  }, {
    teamOneSetWins: 0,
    teamTwoSetWins: 0,
    teamOneTotalPoints: 0,
    teamTwoTotalPoints: 0,
  });

  if (totals.teamOneSetWins > totals.teamTwoSetWins) {
    return { ...totals, winningSide: 'teamOne' };
  }
  if (totals.teamTwoSetWins > totals.teamOneSetWins) {
    return { ...totals, winningSide: 'teamTwo' };
  }
  if (totals.teamOneTotalPoints > totals.teamTwoTotalPoints) {
    return { ...totals, winningSide: 'teamOne' };
  }
  if (totals.teamTwoTotalPoints > totals.teamOneTotalPoints) {
    return { ...totals, winningSide: 'teamTwo' };
  }

  return { ...totals, winningSide: null };
}

function parseMatchDate(match) {
  return Moment(match.last_edit || match.date_added, 'YYYY-MM-DD-HH:mm:ss', true);
}

export function groupMatchesByDate(matches) {
  const groups = {};
  (matches || []).forEach(match => {
    const date = parseMatchDate(match);
    const key = date.clone().startOf('day').unix();
    if (!groups[key]) {
      groups[key] = {
        key,
        label: date.format('ddd MMM D, YYYY').toUpperCase(),
        matches: [],
      };
    }
    groups[key].matches.push(match);
  });

  return Object.values(groups)
    .sort((a, b) => b.key - a.key)
    .map(group => ({
      ...group,
      matches: group.matches.sort((a, b) => parseMatchDate(b).unix() - parseMatchDate(a).unix()),
    }));
}

export function summarizeMatch(match, players) {
  const date = parseMatchDate(match);
  const ids = match.players || [];
  const matchPlayers = ids.map(id => makeMatchPlayer(id, players));
  const isSingles = match.event === 'Singles';
  const teamOnePlayers = isSingles ? matchPlayers.slice(0, 1) : matchPlayers.slice(0, 2);
  const teamTwoPlayers = isSingles ? matchPlayers.slice(1, 2) : matchPlayers.slice(2, 4);
  const teamOne = formatTeam(teamOnePlayers);
  const teamTwo = formatTeam(teamTwoPlayers);
  const winners = match.winners || [];
  const teamOneWon = winners.includes(ids[0]);
  const teamTwoWon = winners.includes(isSingles ? ids[1] : ids[2]);
  const scores = match.score || [];
  const sets = [];

  for (let index = 0; index < scores.length; index += 2) {
    const teamOneScore = Number(scores[index] || 0);
    const teamTwoScore = Number(scores[index + 1] || 0);
    if (teamOneScore > 0 || teamTwoScore > 0) {
      sets.push({ teamOne: teamOneScore, teamTwo: teamTwoScore });
    }
  }
  const winnerSummary = summarizeWinner(sets);

  return {
    id: match.id,
    event: match.event || 'Singles',
    category: match.category || 'Practice',
    time: date.format('h:mm A'),
    dateTimeLabel: date.format('ddd MMM D, YYYY · h:mm A'),
    teamOne,
    teamTwo,
    teamOnePlayers,
    teamTwoPlayers,
    ...winnerSummary,
    teamOneWon,
    teamTwoWon,
    sets,
  };
}

export function filterMatchesByEvent(matches, eventKey) {
  if (eventKey === 'all') return matches || [];
  return (matches || []).filter(match => (match.event || '').toLowerCase() === eventKey);
}

export function makeProfileStats(statsRecord, statsRecords = []) {
  if (!statsRecord) return [];
  const singlesRank = findRank(buildWinRankings(statsRecords, 'singles'), statsRecord);
  const doublesRank = findRank(buildWinRankings(statsRecords, 'doubles'), statsRecord);
  const mixedRank = findRank(buildWinRankings(statsRecords, 'mixed'), statsRecord);
  const overallRank = findRank(buildOverallWinRankings(statsRecords), statsRecord);
  const singles = statFromRecord(statsRecord, 'singles', 'SINGLES', '#ff5f6d', singlesRank);
  const doubles = statFromRecord(statsRecord, 'doubles', 'DOUBLES', '#ffa51f', doublesRank);
  const mixed = statFromRecord(statsRecord, 'mixed', 'MIXED', '#16b7ff', mixedRank);
  const overallWins = singles.wins + doubles.wins + mixed.wins;
  const overallLosses = singles.losses + doubles.losses + mixed.losses;
  const total = overallWins + overallLosses;

  return [
    singles,
    doubles,
    mixed,
    {
      label: 'OVERALL',
      color: '#727272',
      winPct: total > 0 ? Math.round((overallWins / total) * 100) : 0,
      rank: overallRank,
      wins: overallWins,
      losses: overallLosses,
    },
  ];
}

export function makeProfileEloCards(statsRecord, singlesRankings = [], doublesRankings = []) {
  if (!statsRecord) return [];

  return [
    makeProfileEloCard('Singles Elo', findRankedPlayer(singlesRankings, statsRecord)),
    makeProfileEloCard('Doubles Elo', findRankedPlayer(doublesRankings, statsRecord)),
  ].filter(Boolean);
}

function statFromRecord(record, eventKey, label, color, rank) {
  const wins = Number(record[`${eventKey}_wins`] || 0);
  const losses = Number(record[`${eventKey}_losses`] || 0);
  const total = wins + losses;
  return {
    label,
    color,
    winPct: total > 0 ? Math.round((wins / total) * 100) : 0,
    rank,
    wins,
    losses,
  };
}

function makeProfileEloCard(label, ranking) {
  if (!ranking) return undefined;

  return {
    label,
    rank: ranking.rank,
    mu: ranking.mu,
    sigma: ranking.sigma,
    games: ranking.games,
    winPct: ranking.winPct,
  };
}

function findRank(rankings, player) {
  const match = findRankedPlayer(rankings, player);
  return match ? match.rank : undefined;
}

function findRankedPlayer(rankings, player) {
  if (!player) return undefined;

  const playerId = Number(player.id);
  if (Number.isFinite(playerId)) {
    const idMatch = (rankings || []).find(row => Number(row.id) === playerId);
    if (idMatch) return idMatch;
  }

  const playerName = normalizePlayerName(player.name || formatPlayerName(player));
  return (rankings || []).find(row => normalizePlayerName(row.name) === playerName);
}
