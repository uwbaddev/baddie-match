import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../Contexts/AppContext';
import EloPage from './EloPage';

test('elo rankings link player names to official roster profiles when matched', async () => {
  render(
    <MemoryRouter>
      <AppContext.Provider
        value={{
          players: [{ id: 8, first_name: 't_Liam', last_name: 'Zhang' }],
          queryElo: () => Promise.resolve([
            {
              name: 't_Liam Zhang',
              singles_elo: 1042,
              singles_rating: { mu: 31, sigma: 2.8 },
              singles_games_played: 3,
              singles_win_pct: 0.67,
            },
          ]),
          queryStats: () => Promise.resolve([]),
        }}
      >
        <EloPage />
      </AppContext.Provider>
    </MemoryRouter>
  );

  const link = await screen.findByRole('link', { name: 'Liam Zhang' });
  expect(link).toHaveAttribute('href', '/players/2025-26/liam-zhang');
  expect(link).toHaveClass('table-name-link');
  expect(link).not.toHaveClass('name-pill');
  expect(screen.queryByRole('option', { name: '2024 - 2025' })).not.toBeInTheDocument();
});
