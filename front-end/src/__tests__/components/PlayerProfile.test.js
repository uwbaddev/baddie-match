import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppContext } from '../../Contexts/AppContext';
import PlayerProfile from '../../components/PlayerProfile';

const statsRecord = (id, name, wins, overrides = {}) => ({
  id,
  name,
  singles_wins: wins,
  singles_losses: 1,
  doubles_wins: 0,
  doubles_losses: 0,
  mixed_wins: 0,
  mixed_losses: 0,
  ...overrides,
});

const profileMatch = (id, day, hour = 7) => ({
  id,
  players: [113, 2],
  event: 'Singles',
  category: 'Practice',
  score: [21, 15],
  winners: [113],
  last_edit: `2025-09-${String(day).padStart(2, '0')}-${String(hour).padStart(2, '0')}:00:00`,
});

const renderProfile = ({
  route = '/v2/players/2024-25/allison-cheng',
  players = [{ id: 1, first_name: 'Allison', last_name: 'Cheng', elegible_year: 0 }],
  statsByStart = {
    '2024-09-01': [statsRecord(1, 'Allison Cheng', 2)],
    '2000-09-01': [statsRecord(1, 'Allison Cheng', 5)],
  },
  eloByEvent = {},
  playerMatchesByStart = {},
} = {}) => {
  const queryStats = jest.fn((start) => Promise.resolve(statsByStart[start] || []));
  const queryPlayerResults = jest.fn((id, start) => Promise.resolve(
    playerMatchesByStart[start] || (start === '2000-09-01'
      ? [{ id: 2, players: [1, 2], event: 'Singles', category: 'Practice', score: [21, 15], winners: [1], last_edit: '2025-09-05-07:00:00' }]
      : [])
  ));
  const queryElo = jest.fn((event) => Promise.resolve(eloByEvent[event] || []));
  const LocationProbe = () => {
    const location = useLocation();
    return <span data-testid="current-path">{location.pathname}</span>;
  };

  const renderResult = render(
    <MemoryRouter initialEntries={[route]}>
      <AppContext.Provider value={{ players, queryStats, queryPlayerResults, queryElo }}>
        <LocationProbe />
        <Routes>
          <Route path="/v2/players/:season/id/:id" element={<PlayerProfile />} />
          <Route path="/v2/players/:season/:slug" element={<PlayerProfile />} />
          <Route path="/v2/players/:id" element={<PlayerProfile />} />
        </Routes>
      </AppContext.Provider>
    </MemoryRouter>
  );

  return { queryStats, queryPlayerResults, queryElo, ...renderResult };
};

test('shows route-season bio details with the latest available player photo', async () => {
  const { container } = renderProfile();

  expect(await screen.findByRole('heading', { name: 'Allison Cheng' })).toBeInTheDocument();
  expect(screen.getByTestId('current-path')).toHaveTextContent('/v2/players/2024-25/allison-cheng');
  expect(screen.queryByText('First Year')).not.toBeInTheDocument();
  expect(container.querySelector('.profile-hero-title')).toHaveTextContent('Allison Cheng');
  expect(container.querySelector('.profile-hero')).toBeInTheDocument();
  expect(container.querySelector('.profile-hero-media')).toContainElement(screen.getByRole('img', { name: /Allison Cheng/i }));
  expect(container.querySelector('.profile-hero-content')).toHaveClass('is-left-aligned');
  expect(container.querySelector('.profile-hero-content')).toContainElement(container.querySelector('.profile-hero-title'));
  expect(screen.getByText('Math/CPA')).toBeInTheDocument();
  expect(screen.queryByText('St. Clements')).not.toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Allison Cheng/i })).toHaveAttribute(
    'src',
    expect.stringContaining('2026/3/4/Allison_Cheng_DxO.jpg')
  );
  const statsSelect = await screen.findByRole('combobox', { name: /Stats season/i });
  await waitFor(() => expect(statsSelect).toHaveValue('all'));
  expect(screen.queryByRole('option', { name: '2024 - 2025' })).not.toBeInTheDocument();
  await waitFor(() => expect(screen.getAllByText('83%').length).toBeGreaterThan(0));
});

test('shows route-season bio details from database-id season profile routes', async () => {
  const { queryPlayerResults } = renderProfile({
    route: '/v2/players/2024-25/id/1',
  });

  expect(await screen.findByRole('heading', { name: 'Allison Cheng' })).toBeInTheDocument();
  expect(screen.getByTestId('current-path')).toHaveTextContent('/v2/players/2024-25/id/1');
  expect(screen.getByText('Math/CPA')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Allison Cheng/i })).toHaveAttribute(
    'src',
    expect.stringContaining('2026/3/4/Allison_Cheng_DxO.jpg')
  );
  await waitFor(() => expect(queryPlayerResults).toHaveBeenCalledWith(1, '2000-09-01', '3000-09-01'));
});

test('renders local database profile when season-id route has no roster record for that season', async () => {
  renderProfile({
    route: '/v2/players/2024-25/id/999',
    players: [{ id: 999, first_name: 't_Test', last_name: 'Player', elegible_year: 0 }],
    statsByStart: {
      '2000-09-01': [statsRecord(999, 't_Test Player', 1)],
    },
  });

  expect(await screen.findByRole('heading', { name: 'Test Player' })).toBeInTheDocument();
  expect(screen.queryByText('Program')).not.toBeInTheDocument();
});

test('defaults stats to route season when that season has stats and can switch to all time', async () => {
  const { queryStats } = renderProfile({
    route: '/v2/players/2025-26/allison-cheng',
    statsByStart: {
      '2025-09-01': [statsRecord(1, 'Allison Cheng', 2)],
      '2000-09-01': [statsRecord(1, 'Allison Cheng', 5)],
    },
  });

  const statsSelect = await screen.findByRole('combobox', { name: /Stats season/i });
  await waitFor(() => expect(statsSelect).toHaveValue('2025-26'));

  expect(queryStats).toHaveBeenCalledWith('2025-09-01', '2026-08-31');

  await userEvent.selectOptions(statsSelect, 'all');

  await waitFor(() => expect(queryStats).toHaveBeenCalledWith('2000-09-01', '3000-09-01'));
  await waitFor(() => expect(screen.getAllByText('83%').length).toBeGreaterThan(0));
});

test('renders win-rate ranks, elo cards, and date labels for recent matches', async () => {
  renderProfile({
    route: '/v2/players/2025-26/id/113',
    players: [
      { id: 113, first_name: 't_Liam', last_name: 'Zhang', elegible_year: 0 },
      { id: 2, first_name: 'Allison', last_name: 'Cheng', elegible_year: 0 },
      { id: 3, first_name: 'Ben', last_name: 'Singh', elegible_year: 0 },
    ],
    statsByStart: {
      '2025-09-01': [
        statsRecord(113, 't_Liam Zhang', 8, { singles_losses: 2, doubles_wins: 5, doubles_losses: 3, mixed_wins: 4, mixed_losses: 4 }),
        statsRecord(2, 'Allison Cheng', 9, { doubles_wins: 6, doubles_losses: 2, mixed_wins: 7, mixed_losses: 1 }),
        statsRecord(3, 'Ben Singh', 2, { singles_losses: 6, doubles_wins: 2, doubles_losses: 6, mixed_wins: 2, mixed_losses: 6 }),
      ],
    },
    eloByEvent: {
      singles: [
        { name: 'Liam Zhang', singles_elo: 1042, singles_rating: { mu: 31.4, sigma: 2.8 }, singles_games_played: 8, singles_win_pct: 0.67 },
        { name: 'Allison Cheng', singles_elo: 1000, singles_rating: { mu: 28.1, sigma: 3.1 }, singles_games_played: 8, singles_win_pct: 0.5 },
      ],
      doubles: [
        { name: 'Allison Cheng', doubles_rating: { mu: 29.2, sigma: 2.7 }, doubles_games_played: 8, doubles_win_pct: 0.5 },
        { name: 't_Liam Zhang', doubles_rating: { mu: 27.4, sigma: 3.2 }, doubles_games_played: 8, doubles_win_pct: 0.25 },
      ],
    },
    playerMatchesByStart: {
      '2025-09-01': [
        { id: 2, players: [113, 2], event: 'Singles', category: 'Practice', score: [21, 15], winners: [113], last_edit: '2025-09-05-07:00:00' },
      ],
    },
  });

  expect(await screen.findByRole('heading', { name: 'Liam Zhang' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Stats' })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Win Rate' })).toBeInTheDocument();
  expect(screen.queryByText('#-')).not.toBeInTheDocument();
  expect(screen.getAllByText('#2').length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: 'Elo Rankings' })).toBeInTheDocument();
  expect(screen.getByText('Singles Elo')).toBeInTheDocument();
  expect(screen.getByText('Doubles Elo')).toBeInTheDocument();
  expect(screen.getByText('31.40')).toBeInTheDocument();
  expect(screen.getByText('27.40')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Matches with Liam Zhang' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Recent matches with Liam Zhang' })).not.toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'FRI SEP 5, 2025' })).toBeInTheDocument();
  expect(screen.getByText('7:00 AM')).toBeInTheDocument();
  expect(screen.queryByText('Fri Sep 5, 2025 · 7:00 AM')).not.toBeInTheDocument();
});

test('fetches player-specific matches for the selected stats range', async () => {
  const { queryPlayerResults } = renderProfile({
    route: '/v2/players/2025-26/id/113',
    players: [
      { id: 113, first_name: 't_Liam', last_name: 'Zhang', elegible_year: 0 },
      { id: 2, first_name: 'Allison', last_name: 'Cheng', elegible_year: 0 },
    ],
    statsByStart: {
      '2025-09-01': [statsRecord(113, 't_Liam Zhang', 2)],
    },
    playerMatchesByStart: {
      '2025-09-01': [
        { id: 250, players: [113, 2], event: 'Singles', category: 'Practice', score: [21, 15], winners: [113], last_edit: '2025-11-10-08:30:00' },
      ],
    },
  });

  await waitFor(() => expect(queryPlayerResults).toHaveBeenCalledWith(113, '2025-09-01', '2026-08-31'));
  expect(await screen.findByRole('heading', { name: 'MON NOV 10, 2025' })).toBeInTheDocument();
  expect(screen.getByText('8:30 AM')).toBeInTheDocument();
});

test('paginates player profile match history after six matches', async () => {
  renderProfile({
    route: '/v2/players/2025-26/id/113',
    players: [
      { id: 113, first_name: 't_Liam', last_name: 'Zhang', elegible_year: 0 },
      { id: 2, first_name: 'Allison', last_name: 'Cheng', elegible_year: 0 },
    ],
    statsByStart: {
      '2025-09-01': [statsRecord(113, 't_Liam Zhang', 2)],
    },
    playerMatchesByStart: {
      '2025-09-01': Array.from({ length: 7 }, (_, index) => profileMatch(index + 1, index + 1, index + 7)),
    },
  });

  expect(await screen.findByLabelText('Profile match pages')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '1' })).toHaveClass('is-active');
  expect(screen.getByText('7:00 AM')).toBeInTheDocument();
  expect(screen.queryByText('1:00 PM')).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: '2' }));

  expect(await screen.findByText('1:00 PM')).toBeInTheDocument();
  expect(screen.queryByText('7:00 AM')).not.toBeInTheDocument();
});

test('caps profile match pagination at five numbered buttons', async () => {
  renderProfile({
    route: '/v2/players/2025-26/id/113',
    players: [
      { id: 113, first_name: 't_Liam', last_name: 'Zhang', elegible_year: 0 },
      { id: 2, first_name: 'Allison', last_name: 'Cheng', elegible_year: 0 },
    ],
    statsByStart: {
      '2025-09-01': [statsRecord(113, 't_Liam Zhang', 2)],
    },
    playerMatchesByStart: {
      '2025-09-01': Array.from({ length: 37 }, (_, index) => profileMatch(index + 1, (index % 28) + 1, (index % 12) + 1)),
    },
  });

  const pagination = await screen.findByLabelText('Profile match pages');
  const pageButtons = Array.from(pagination.querySelectorAll('button:not([aria-label])'));
  expect(pageButtons.map(button => button.textContent)).toEqual(['1', '2', '3', '4', '5']);
  expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
});

test('changing profile stats season resets match pagination to page one', async () => {
  renderProfile({
    route: '/v2/players/2025-26/id/113',
    players: [
      { id: 113, first_name: 't_Liam', last_name: 'Zhang', elegible_year: 0 },
      { id: 2, first_name: 'Allison', last_name: 'Cheng', elegible_year: 0 },
    ],
    statsByStart: {
      '2025-09-01': [statsRecord(113, 't_Liam Zhang', 2)],
      '2000-09-01': [statsRecord(113, 't_Liam Zhang', 5)],
    },
    playerMatchesByStart: {
      '2025-09-01': Array.from({ length: 7 }, (_, index) => profileMatch(index + 1, index + 1, index + 7)),
      '2000-09-01': [
        { ...profileMatch(100, 20, 9), last_edit: '2025-10-20-09:00:00' },
        { ...profileMatch(101, 21, 10), last_edit: '2025-10-21-10:00:00' },
      ],
    },
  });

  await screen.findByLabelText('Profile match pages');
  await userEvent.click(screen.getByRole('button', { name: '2' }));
  expect(await screen.findByText('1:00 PM')).toBeInTheDocument();

  await userEvent.selectOptions(screen.getByRole('combobox', { name: /Stats season/i }), 'all');

  await waitFor(() => expect(screen.queryByLabelText('Profile match pages')).not.toBeInTheDocument());
  expect(screen.getByText('9:00 AM')).toBeInTheDocument();
  expect(screen.queryByText('1:00 PM')).not.toBeInTheDocument();
});

test('falls back to all-time stats when route season has no stats', async () => {
  renderProfile({
    statsByStart: {
      '2000-09-01': [statsRecord(1, 'Allison Cheng', 5)],
    },
  });

  const statsSelect = await screen.findByRole('combobox', { name: /Stats season/i });

  await waitFor(() => expect(statsSelect).toHaveValue('all'));
  await waitFor(() => expect(screen.getAllByText('83%').length).toBeGreaterThan(0));
});

test('shows roster bio without stats when no local player matches', async () => {
  renderProfile({ players: [] });

  expect(await screen.findByRole('heading', { name: 'Allison Cheng' })).toBeInTheDocument();
  expect(screen.getByText('Math/CPA')).toBeInTheDocument();
  expect(screen.getByText('No stats found for this player.')).toBeInTheDocument();
  expect(screen.getByText('No matches found for this stats range.')).toBeInTheDocument();
  expect(screen.queryByText('No recent matches found.')).not.toBeInTheDocument();
});

test('maps legacy local profile routes to official roster display when names match', async () => {
  renderProfile({
    route: '/v2/players/113',
    players: [{ id: 113, first_name: 't_Liam', last_name: 'Zhang', elegible_year: 0 }],
    statsByStart: {
      '2025-09-01': [statsRecord(113, 't_Liam Zhang', 2)],
      '2000-09-01': [statsRecord(113, 't_Liam Zhang', 5)],
    },
  });

  expect(await screen.findByRole('heading', { name: 'Liam Zhang' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 't_Liam Zhang' })).not.toBeInTheDocument();
  expect(screen.getByText('Computer Engineering')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Liam Zhang/i })).toHaveAttribute(
    'src',
    expect.stringContaining('2026/3/4/Liam_Zhang_DxO.jpg')
  );
});

test('shows coach profiles with title while matching local stats', async () => {
  renderProfile({
    route: '/v2/players/2025-26/id/39',
    players: [{ id: 39, first_name: 't_Ivan', last_name: 'Cheng', elegible_year: 0 }],
    statsByStart: {
      '2025-09-01': [statsRecord(39, 't_Ivan Cheng', 2)],
      '2000-09-01': [statsRecord(39, 't_Ivan Cheng', 5)],
    },
  });

  expect(await screen.findByRole('heading', { name: 'Ivan Cheng' })).toBeInTheDocument();
  expect(screen.getByText('Assistant Coach')).toBeInTheDocument();
  expect(screen.queryByText('First Year')).not.toBeInTheDocument();
  await waitFor(() => expect(screen.getAllByText('67%').length).toBeGreaterThan(0));
});

test('legacy local profile routes strip seeded prefixes when no roster match exists', async () => {
  renderProfile({
    route: '/v2/players/999',
    players: [{ id: 999, first_name: 't_Test', last_name: 'Player', elegible_year: 0 }],
    statsByStart: {
      '2000-09-01': [statsRecord(999, 't_Test Player', 1)],
    },
  });

  expect(await screen.findByRole('heading', { name: 'Test Player' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 't_Test Player' })).not.toBeInTheDocument();
});
