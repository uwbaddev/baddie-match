import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../../Contexts/AppContext';
import LandingPage from '../../components/LandingPage';

test('home rankings render player names as plain links instead of name pills', async () => {
  render(
    <MemoryRouter>
      <AppContext.Provider
        value={{
          queryStats: () => Promise.resolve([
            { id: 7, name: 't_Liam Zhang', singles_wins: 6, singles_losses: 2 },
            { id: 8, name: 'Low Sample', singles_wins: 7, singles_losses: 0 },
          ]),
        }}
      >
        <LandingPage />
      </AppContext.Provider>
    </MemoryRouter>
  );

  const link = await screen.findByRole('link', { name: 'Liam Zhang' });

  expect(link).toHaveAttribute('href', '/players/2025-26/id/7');
  expect(link).not.toHaveClass('name-pill');
  expect(screen.queryByText('Low Sample')).not.toBeInTheDocument();
  expect(screen.queryByRole('option', { name: '2024 - 2025' })).not.toBeInTheDocument();
});
