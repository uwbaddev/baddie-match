import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AppContext } from '../../Contexts/AppContext';
import MainRouter from '../../Routers/MainRouter';

beforeAll(() => {
  window.matchMedia = window.matchMedia || function matchMedia() {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };
});

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

test('base home route renders the legacy site and links to v2', async () => {
  const { contextValue } = renderRoute('/');

  expect(screen.getByText(/Welcome to the official site/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Try V2/i })).toHaveAttribute('href', '/v2');
  await waitFor(() => expect(contextValue.queryStats).toHaveBeenCalled());
});

test('v2 home route renders the redesigned team statistics page', async () => {
  renderRoute('/v2');

  expect(await screen.findByRole('heading', { name: 'Team Statistics' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Report Match' })).toHaveAttribute('href', '/v2/report');
  expect(screen.getByRole('link', { name: 'Back to V1' })).toHaveAttribute('href', '/');
});

test('v2 mobile menu includes a back to v1 link', async () => {
  renderRoute('/v2');

  expect(await screen.findByRole('heading', { name: 'Team Statistics' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

  const backLinks = screen.getAllByRole('link', { name: 'Back to V1' });
  expect(backLinks).toHaveLength(2);
  expect(backLinks[1]).toHaveAttribute('href', '/');
});

test('base and v2 report routes render their respective tab UIs', () => {
  const { container, unmount } = renderRoute('/report');

  expect(screen.getAllByText('REPORT MATCH').length).toBeGreaterThan(0);
  expect(container.querySelector('.report-tabs')).not.toBeInTheDocument();

  unmount();
  const v2 = renderRoute('/v2/report');

  expect(screen.getByRole('heading', { name: 'Report Match' })).toBeInTheDocument();
  expect(v2.container.querySelector('.report-tabs')).toBeInTheDocument();
});

test('base players route renders legacy list while v2 renders roster cards', () => {
  const { unmount } = renderRoute('/players');

  expect(screen.getByText('All Players')).toBeInTheDocument();
  expect(screen.getByText('t_Liam Zhang')).toBeInTheDocument();

  unmount();
  renderRoute('/v2/players');

  expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument();
  expect(screen.getByText('Liam Zhang')).toBeInTheDocument();
});

test('v2 database-id player profile route remains available', async () => {
  renderRoute('/v2/players/2025-26/id/113');

  expect(await screen.findByRole('heading', { name: 'Liam Zhang' })).toBeInTheDocument();
});
