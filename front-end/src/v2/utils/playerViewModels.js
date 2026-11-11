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
  { label: '2026 - 2027', value: '2026-09-01,2027-08-31' },
  { label: '2025 - 2026', value: '2025-09-01,2026-08-31' },
  { label: '2023 - 2024', value: '2023-09-01,2024-08-31' },
  { label: '2022 - 2023', value: '2022-09-01,2023-08-31' },
  { label: '2021 - 2022', value: '2021-09-01,2022-08-31' },
  { label: 'ALL', value: '2000-09-01,3000-09-01' },
];

const YEAR_LABELS = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
const AVATAR_THEMES = ['avatar-a', 'avatar-b', 'avatar-c', 'avatar-d'];
export const MIN_RANKING_GAMES = 8;

// Elo grouping. Players are ordered by a cautious score (mu - ELO_SCORE_SIGMAS * sigma) and
// split into groups at natural breaks in that score (see groupByNaturalBreaks).
export const ELO_SCORE_SIGMAS = 2;
// Number of groups = floor(placed players / ELO_PLAYERS_PER_GROUP), kept within MIN..MAX groups
// and never so many that a group would have fewer than ELO_MIN_GROUP_SIZE players.
export const ELO_PLAYERS_PER_GROUP = 5;
export const ELO_MIN_GROUPS = 3;
export const ELO_MAX_GROUPS = 5;
export const ELO_MIN_GROUP_SIZE = 4;
export const ELO_PROMOTION_SPOTS = 2;
// Top group only: the highest scores get 1st/2nd/3rd medals, shown in order.
export const ELO_PODIUM_SPOTS = 3;
// Games needed before a player is placed in a group; until then they are "getting placed".
export const ELO_PLACEMENT_GAMES = { singles: 5, doubles: 8 };

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

export function shuffle(items, rng = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function getEloPromotionSpots(groupIndex, groupSize) {
  if (groupIndex === 0) return 0;
  if (groupSize >= 5) return ELO_PROMOTION_SPOTS;
  if (groupSize >= 3) return 1;
  return 0;
}

function makeEloRow(player, eventKey) {
  const rating = player[`${eventKey}_rating`];
  if (!rating || !Number.isFinite(Number(rating.mu)) || !Number.isFinite(Number(rating.sigma))) {
    return undefined;
  }
  const winPct = player[`${eventKey}_win_pct`];
  const mu = Number(rating.mu);
  const sigma = Number(rating.sigma);
  return {
    id: player.id,
    to: getPlayerProfilePath(player),
    name: cleanSeedPrefix(player.name || 'Player Name'),
    mu,
    sigma,
    score: mu - ELO_SCORE_SIGMAS * sigma,
    winPct: Number.isFinite(winPct) ? Math.round(winPct * 100) : 0,
    games: Number(player[`${eventKey}_games_played`] || 0),
  };
}

/**
 * Split players into groups with natural breaks (Jenks): choose the boundaries that keep
 * each group's scores as tight as possible (minimum total within-group squared deviation),
 * with every group at least ELO_MIN_GROUP_SIZE players. The number of groups comes from the
 * player count, so groups don't collapse or fragment as sigma shrinks over a season.
 * rows must be sorted by score, highest first.
 */
export function getEloGroupCount(playerCount) {
  if (playerCount === 0) return 0;
  const target = Math.floor(playerCount / ELO_PLAYERS_PER_GROUP);
  const clamped = Math.min(ELO_MAX_GROUPS, Math.max(ELO_MIN_GROUPS, target));
  return Math.max(1, Math.min(clamped, Math.floor(playerCount / ELO_MIN_GROUP_SIZE)));
}

function groupByNaturalBreaks(rows) {
  const n = rows.length;
  const groupCount = getEloGroupCount(n);
  if (groupCount <= 1) return n ? [rows] : [];

  const minSize = ELO_MIN_GROUP_SIZE;
  const sum = [0];
  const sumSq = [0];
  rows.forEach(row => {
    sum.push(sum[sum.length - 1] + row.score);
    sumSq.push(sumSq[sumSq.length - 1] + row.score * row.score);
  });
  // squared deviation of rows[start..end) from their mean
  const cost = (start, end) => {
    const total = sum[end] - sum[start];
    return (sumSq[end] - sumSq[start]) - (total * total) / (end - start);
  };

  // best[g][end]: lowest cost of splitting rows[0..end) into g groups; from[g][end]: where group g starts
  const best = Array.from({ length: groupCount + 1 }, () => new Array(n + 1).fill(Infinity));
  const from = Array.from({ length: groupCount + 1 }, () => new Array(n + 1).fill(0));
  best[0][0] = 0;
  for (let g = 1; g <= groupCount; g += 1) {
    for (let end = g * minSize; end <= n; end += 1) {
      for (let start = (g - 1) * minSize; start <= end - minSize; start += 1) {
        const total = best[g - 1][start] + cost(start, end);
        if (total < best[g][end]) {
          best[g][end] = total;
          from[g][end] = start;
        }
      }
    }
  }

  const groups = [];
  let end = n;
  for (let g = groupCount; g >= 1; g -= 1) {
    const start = from[g][end];
    groups.unshift(rows.slice(start, end));
    end = start;
  }
  return groups;
}

/**
 * Build the grouped Elo view for one event.
 * Returns { groups: [{ key, label, players }], placing: [player] }.
 * Players with 0 games are omitted. Players below ELO_PLACEMENT_GAMES are in `placing`
 * (alphabetical). The top group lists its 1st/2nd/3rd (`podium`) first in order, then the
 * rest shuffled. Lower groups list promotion-spot players first, then everyone else; both
 * parts are shuffled so the order inside those groups is not a ranking.
 */
export function buildEloGroups(elo, eventKey, rng = Math.random) {
  const placementGames = ELO_PLACEMENT_GAMES[eventKey] || MIN_RANKING_GAMES;
  const rows = (elo || [])
    .map(player => makeEloRow(player, eventKey))
    .filter(row => row && row.games > 0);

  const placing = rows
    .filter(row => row.games < placementGames)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(row => ({ ...row, placementGames }));

  const placed = rows
    .filter(row => row.games >= placementGames)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const groups = groupByNaturalBreaks(placed).map((group, index) => {
    const label = `Group ${index + 1}`;
    let leaders;
    let rest;
    if (index === 0) {
      // podium: kept in score order, not shuffled
      leaders = group.slice(0, ELO_PODIUM_SPOTS).map((row, place) => ({ ...row, podium: place + 1, promotion: false }));
      rest = group.slice(ELO_PODIUM_SPOTS);
    } else {
      const spots = getEloPromotionSpots(index, group.length);
      leaders = shuffle(group.slice(0, spots).map(row => ({ ...row, promotion: true })), rng);
      rest = group.slice(spots);
    }
    rest = shuffle(rest.map(row => ({ ...row, promotion: false })), rng);
    return {
      key: `group-${index + 1}`,
      label,
      players: [...leaders, ...rest].map(row => ({ ...row, groupLabel: label })),
    };
  });

  return { groups, placing };
}

export function findEloStanding(eloGroups, player) {
  if (!eloGroups) return undefined;
  const placed = findRankedPlayer(eloGroups.groups.flatMap(group => group.players), player);
  if (placed) return placed;
  const placing = findRankedPlayer(eloGroups.placing, player);
  return placing ? { ...placing, placing: true } : undefined;
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

export function makeProfileEloCards(statsRecord, singlesGroups, doublesGroups) {
  if (!statsRecord) return [];

  return [
    makeProfileEloCard('Singles Elo', findEloStanding(singlesGroups, statsRecord)),
    makeProfileEloCard('Doubles Elo', findEloStanding(doublesGroups, statsRecord)),
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

function makeProfileEloCard(label, standing) {
  if (!standing) return undefined;

  return {
    label,
    groupLabel: standing.placing ? undefined : standing.groupLabel,
    promotion: Boolean(standing.promotion),
    podium: standing.podium,
    placing: Boolean(standing.placing),
    placementGames: standing.placementGames,
    games: standing.games,
    winPct: standing.winPct,
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
