import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AppContext } from '../../Contexts/AppContext';
import MainRouter from '../../Routers/MainRouter';

const renderRoute = (route) => {
  const contextValue = {
    players: [
      { id: 1, first_name: 'Allison', last_name: 'Cheng', elegible_year: 0, sex: 'F' },
      { id: 113, first_name: 't_Liam', last_name: 'Zhang', elegible_year: 0, sex: 'M' },
    ],
    activePlayers: [
      { id: 1, first_name: 'Allison', last_name: 'Cheng', elegible_year: 0, sex: 'F' },
      { id: 113, first_name: 't_Liam', last_name: 'Zhang', elegible_year: 0, sex: 'M' },
    ],
    categories: [{ name: 'Practice' }],
    queryStats: jest.fn(() => Promise.resolve([
      { id: 113, name: 't_Liam Zhang', singles_wins: 5, singles_losses: 3, doubles_wins: 0, doubles_losses: 0, mixed_wins: 0, mixed_losses: 0 },
    ])),
    queryMatchPage: jest.fn(() => Promise.resolve({
      metadata: { recordCount: '0', pageCount: '1', recordsPerPage: '20' },
      records: [],
    })),
    queryElo: jest.fn(() => Promise.resolve([])),
    queryPlayerResults: jest.fn(() => Promise.resolve([])),
  };
  window.history.pushState({}, '', route);
  const result = render(
    <AppContext.Provider value={contextValue}>
      <MainRouter />
    </AppContext.Provider>
  );
  return { ...result, contextValue };
};

test('home route renders the current site and primary navigation', async () => {
  renderRoute('/');

  expect(await screen.findByRole('heading', { name: 'Team Statistics' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Report Match' })).toHaveAttribute('href', '/report');
  expect(screen.getByRole('navigation', { name: 'Primary' }).querySelectorAll('a')).toHaveLength(5);
});

test('unmatched routes return to the home page', async () => {
  renderRoute('/missing-page');
  expect(await screen.findByRole('heading', { name: 'Team Statistics' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
});

test('mobile menu contains only current pages', async () => {
  renderRoute('/');

  expect(await screen.findByRole('heading', { name: 'Team Statistics' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

  expect(screen.getByRole('navigation', { name: 'Mobile primary' }).querySelectorAll('a')).toHaveLength(5);
});

test.each([
  ['/', 'Home'],
  ['/report', 'Report Match'],
  ['/results', 'Results'],
  ['/elo', 'Rankings'],
  ['/players', 'Roster'],
  ['/players/', 'Roster'],
  ['/players/2025-26/id/113', 'Player Profile'],
])('mobile menu subtitle follows %s', async (route, label) => {
  renderRoute(route);
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
  const menu = screen.getByRole('dialog', { name: 'Main menu' });
  expect(menu.querySelector('.mobile-menu-brand small')).toHaveTextContent(label);
  await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument());
});

test('report route renders the current match form', () => {
  const { container } = renderRoute('/report');

  expect(screen.getByRole('heading', { name: 'Report Match' })).toBeInTheDocument();
  expect(container.querySelector('.report-tabs')).toBeInTheDocument();
});

test('players route renders roster cards', () => {
  renderRoute('/players');

  expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument();
  expect(screen.getByText('Liam Zhang')).toBeInTheDocument();
});

test('database-id player profile route is available', async () => {
  renderRoute('/players/2025-26/id/113');

  expect(await screen.findByRole('heading', { name: 'Liam Zhang' })).toBeInTheDocument();
});

test('old /v2 links redirect to the same page at the new path', async () => {
  renderRoute('/v2/players/2025-26/id/113?tab=stats#recent');

  expect(await screen.findByRole('heading', { name: 'Liam Zhang' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/players/2025-26/id/113');
  expect(window.location.search).toBe('?tab=stats');
  expect(window.location.hash).toBe('#recent');
});

test('old /v2 home link redirects to the home page', async () => {
  renderRoute('/v2');

  expect(await screen.findByRole('heading', { name: 'Team Statistics' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
});
