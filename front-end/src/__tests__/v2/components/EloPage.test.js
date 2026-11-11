import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../../../Contexts/AppContext';
import EloPage from '../../../v2/components/EloPage';

const renderEloPage = (contextValue) => render(
  <MemoryRouter>
    <AppContext.Provider value={contextValue}>
      <EloPage />
    </AppContext.Provider>
  </MemoryRouter>
);

test('elo groups link player names to official roster profiles when matched', async () => {
  renderEloPage({
    players: [{ id: 8, first_name: 't_Liam', last_name: 'Zhang' }],
    queryElo: () => Promise.resolve([
      {
        id: 8,
        name: 't_Liam Zhang',
        singles_elo: 1042,
        singles_rating: { mu: 31, sigma: 2.8 },
        singles_games_played: 8,
        singles_win_pct: 0.67,
      },
      {
        name: 'Never Played',
        singles_rating: { mu: 25, sigma: 8.33 },
        singles_games_played: 0,
        singles_win_pct: null,
      },
    ]),
  });

  const link = await screen.findByRole('link', { name: 'Liam Zhang' });
  expect(screen.getByRole('button', { name: 'Singles' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Doubles' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Mixed' })).not.toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/players/2025-26/id/8');
  expect(link).toHaveClass('table-name-link');
  expect(link).not.toHaveClass('name-pill');
  expect(screen.queryByText('Never Played')).not.toBeInTheDocument();
  expect(screen.queryByRole('option', { name: '2024 - 2025' })).not.toBeInTheDocument();
});

const makeGroupedRows = (prefix, eventKey = 'singles') => [
  // top cluster
  ...[1, 2, 3, 4].map(index => ({
    name: `${prefix} Top ${index}`,
    [`${eventKey}_rating`]: { mu: 40 - index * 0.1, sigma: 1 },
    [`${eventKey}_games_played`]: 20,
    [`${eventKey}_win_pct`]: 0.8,
  })),
  // lower cluster: Lower 1 has the best score in the group
  ...[1, 2, 3, 4].map(index => ({
    name: `${prefix} Lower ${index}`,
    [`${eventKey}_rating`]: { mu: 20 - index * 0.1, sigma: 1 },
    [`${eventKey}_games_played`]: 20,
    [`${eventKey}_win_pct`]: 0.4,
  })),
  {
    name: `${prefix} Newcomer`,
    [`${eventKey}_rating`]: { mu: 30, sigma: 6 },
    [`${eventKey}_games_played`]: 2,
    [`${eventKey}_win_pct`]: 1,
  },
];

test('elo page shows groups without ranks or ratings, promotion spots, and players getting placed', async () => {
  renderEloPage({
    players: [],
    queryElo: (event) => Promise.resolve(makeGroupedRows('Player', event)),
  });

  const top = await screen.findByRole('region', { name: 'Group 1' });
  const lower = screen.getByRole('region', { name: 'Group 2' });
  const placing = screen.getByRole('region', { name: 'Getting placed' });

  expect(within(top).getByText('Player Top 1')).toBeInTheDocument();
  expect(within(top).queryByText(/Promotion spot/)).not.toBeInTheDocument();
  const topRows = within(top).getAllByRole('row').slice(1);
  expect(topRows.map(row => within(row).queryByText(/^(1st|2nd|3rd)$/)?.textContent)).toEqual(['1st', '2nd', '3rd', undefined]);

  const lowerRows = within(lower).getAllByRole('row').slice(1);
  expect(within(lowerRows[0]).getByText('Player Lower 1')).toBeInTheDocument();
  expect(within(lowerRows[0]).getByText(/Promotion spot/)).toBeInTheDocument();
  expect(within(lower).getAllByText(/Promotion spot/)).toHaveLength(1);

  expect(within(placing).getByText('Player Newcomer')).toBeInTheDocument();
  expect(within(placing).getByText('2 / 5')).toBeInTheDocument();
  expect(within(placing).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');

  [top, lower].forEach(section => {
    expect(within(section).getByRole('columnheader', { name: 'Games' })).toBeInTheDocument();
    expect(within(section).queryByRole('columnheader', { name: 'Win %' })).not.toBeInTheDocument();
  });
  expect(within(lowerRows[0]).getByText('20')).toBeInTheDocument();

  [top, lower, placing].forEach(section => {
    expect(within(section).queryByRole('columnheader', { name: 'Rank' })).not.toBeInTheDocument();
    expect(within(section).queryByRole('columnheader', { name: 'μ' })).not.toBeInTheDocument();
    expect(within(section).queryByRole('columnheader', { name: 'σ' })).not.toBeInTheDocument();
  });
});

test('elo page folds mu, sigma and cautious score into a details section sorted by score', async () => {
  const { container } = renderEloPage({
    players: [],
    queryElo: (event) => Promise.resolve(makeGroupedRows('Player', event)),
  });

  await screen.findByRole('region', { name: 'Group 1' });
  const details = container.querySelector('details.elo-details');
  expect(details).not.toHaveAttribute('open');
  expect(within(details).getByText('Show details')).toBeInTheDocument();

  const table = within(details).getByRole('table');
  expect(within(table).getByRole('columnheader', { name: 'Score (μ − 2σ)' })).toBeInTheDocument();
  expect(within(table).getByRole('columnheader', { name: 'μ' })).toBeInTheDocument();
  expect(within(table).getByRole('columnheader', { name: 'σ' })).toBeInTheDocument();

  const rows = within(table).getAllByRole('row').slice(1);
  expect(rows).toHaveLength(9);
  // Top 1: mu 39.9, sigma 1 -> score 37.90
  expect(within(rows[0]).getByText('Player Top 1')).toBeInTheDocument();
  expect(within(rows[0]).getByText('37.90')).toBeInTheDocument();
  expect(within(rows[0]).getByText('Group 1')).toBeInTheDocument();
  // Newcomer: mu 30, sigma 6 -> score 18.00, ranks below Top but above Lower
  const newcomer = rows.find(row => within(row).queryByText('Player Newcomer'));
  expect(within(newcomer).getByText('18.00')).toBeInTheDocument();
  expect(within(newcomer).getByText('Getting placed')).toBeInTheDocument();
});

test('elo page regroups when the event or season changes', async () => {
  const queryElo = jest.fn((event, start) => {
    if (start === '2000-09-01') return Promise.resolve(makeGroupedRows('All Time', event));
    return Promise.resolve(makeGroupedRows(event === 'singles' ? 'Singles' : 'Doubles', event));
  });

  renderEloPage({ players: [], queryElo });

  expect((await screen.findAllByText('Singles Top 1'))[0]).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Doubles' }));
  expect((await screen.findAllByText('Doubles Top 1'))[0]).toBeInTheDocument();
  expect(screen.queryAllByText('Singles Top 1')).toHaveLength(0);
  expect(within(screen.getByRole('region', { name: 'Getting placed' })).getByText('2 / 8')).toBeInTheDocument();

  fireEvent.change(screen.getByRole('combobox'), { target: { value: '2000-09-01,3000-09-01' } });
  expect((await screen.findAllByText('All Time Top 1'))[0]).toBeInTheDocument();
});

test('elo page shows an empty message when nobody has played yet', async () => {
  renderEloPage({ players: [], queryElo: () => Promise.resolve([]) });
  expect(await screen.findByText('No matches yet this season.')).toBeInTheDocument();
});
