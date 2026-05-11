import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../../../Contexts/AppContext';
import EloPage from '../../../v2/components/EloPage';

test('elo rankings link player names to official roster profiles when matched', async () => {
  render(
    <MemoryRouter>
      <AppContext.Provider
        value={{
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
              name: 'Low Sample',
              singles_elo: 1100,
              singles_rating: { mu: 35, sigma: 2 },
              singles_games_played: 7,
              singles_win_pct: 1,
            },
            {
              name: 'High Variance',
              singles_elo: 1090,
              singles_rating: { mu: 34, sigma: 4 },
              singles_games_played: 12,
              singles_win_pct: 0.8,
            },
          ]),
        }}
      >
        <EloPage />
      </AppContext.Provider>
    </MemoryRouter>
  );

  const link = await screen.findByRole('link', { name: 'Liam Zhang' });
  expect(screen.getByRole('button', { name: 'Singles' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Doubles' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Mixed' })).not.toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/v2/players/2025-26/id/8');
  expect(link).toHaveClass('table-name-link');
  expect(link).not.toHaveClass('name-pill');
  expect(screen.queryByText('Low Sample')).not.toBeInTheDocument();
  expect(screen.queryByText('High Variance')).not.toBeInTheDocument();
  expect(screen.queryByRole('option', { name: '2024 - 2025' })).not.toBeInTheDocument();
});

const makeEloRows = (prefix, eventKey = 'singles', count = 12) => (
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `${prefix} ${String(index + 1).padStart(2, '0')}`,
    [`${eventKey}_rating`]: { mu: 50 - index, sigma: 2 },
    [`${eventKey}_games_played`]: 8,
    [`${eventKey}_win_pct`]: 0.6,
  }))
);

test('elo rankings paginate below the table and keep ten rows per page', async () => {
  render(
    <MemoryRouter>
      <AppContext.Provider
        value={{
          players: [],
          queryElo: (event) => Promise.resolve(makeEloRows('Paged Elo Player', event)),
        }}
      >
        <EloPage />
      </AppContext.Provider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Paged Elo Player 01')).toBeInTheDocument();
  expect(screen.getByText('Paged Elo Player 10')).toBeInTheDocument();
  expect(screen.queryByText('Paged Elo Player 11')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '2' }));

  expect(await screen.findByText('Paged Elo Player 11')).toBeInTheDocument();
  expect(screen.getByText('Paged Elo Player 12')).toBeInTheDocument();
  expect(screen.queryByText('Paged Elo Player 01')).not.toBeInTheDocument();
});

test('elo rankings reset pagination when event or season changes', async () => {
  const queryElo = jest.fn((event, start) => {
    if (start === '2000-09-01') return Promise.resolve(makeEloRows('All Time Elo Player', event));
    return Promise.resolve(makeEloRows(event === 'singles' ? 'Singles Elo Player' : 'Doubles Elo Player', event));
  });

  render(
    <MemoryRouter>
      <AppContext.Provider value={{ players: [], queryElo }}>
        <EloPage />
      </AppContext.Provider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Singles Elo Player 01')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  expect(await screen.findByText('Singles Elo Player 11')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Doubles' }));
  expect(await screen.findByText('Doubles Elo Player 01')).toBeInTheDocument();
  expect(screen.queryByText('Doubles Elo Player 11')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '2' }));
  expect(await screen.findByText('Doubles Elo Player 11')).toBeInTheDocument();

  fireEvent.change(screen.getByRole('combobox'), { target: { value: '2000-09-01,3000-09-01' } });
  expect(await screen.findByText('All Time Elo Player 01')).toBeInTheDocument();
  expect(screen.queryByText('All Time Elo Player 11')).not.toBeInTheDocument();
});
