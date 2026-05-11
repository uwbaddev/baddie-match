import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../../../Contexts/AppContext';
import LandingPage from '../../../v2/components/LandingPage';

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

  expect(link).toHaveAttribute('href', '/v2/players/2025-26/id/7');
  expect(link).not.toHaveClass('name-pill');
  expect(screen.queryByText('Low Sample')).not.toBeInTheDocument();
  expect(screen.queryByRole('option', { name: '2024 - 2025' })).not.toBeInTheDocument();
});

const makeWinStats = (prefix, eventKey = 'singles', count = 12) => (
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `${prefix} ${String(index + 1).padStart(2, '0')}`,
    [`${eventKey}_wins`]: 9,
    [`${eventKey}_losses`]: 1,
  }))
);

test('home rankings paginate below the table and keep ten rows per page', async () => {
  render(
    <MemoryRouter>
      <AppContext.Provider value={{ queryStats: () => Promise.resolve(makeWinStats('Paged Player')) }}>
        <LandingPage />
      </AppContext.Provider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Paged Player 01')).toBeInTheDocument();
  expect(screen.getByText('Paged Player 10')).toBeInTheDocument();
  expect(screen.queryByText('Paged Player 11')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '2' }));

  expect(await screen.findByText('Paged Player 11')).toBeInTheDocument();
  expect(screen.getByText('Paged Player 12')).toBeInTheDocument();
  expect(screen.queryByText('Paged Player 01')).not.toBeInTheDocument();
});

test('home rankings reset pagination when event or season changes', async () => {
  const queryStats = jest.fn((start) => Promise.resolve(
    start === '2000-09-01'
      ? makeWinStats('All Time Player', 'doubles')
      : [
        ...makeWinStats('Singles Player', 'singles'),
        ...makeWinStats('Doubles Player', 'doubles'),
      ]
  ));

  render(
    <MemoryRouter>
      <AppContext.Provider value={{ queryStats }}>
        <LandingPage />
      </AppContext.Provider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Singles Player 01')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  expect(await screen.findByText('Singles Player 11')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Doubles' }));
  expect(await screen.findByText('Doubles Player 01')).toBeInTheDocument();
  expect(screen.queryByText('Doubles Player 11')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '2' }));
  expect(await screen.findByText('Doubles Player 11')).toBeInTheDocument();

  fireEvent.change(screen.getByRole('combobox'), { target: { value: '2000-09-01,3000-09-01' } });
  expect(await screen.findByText('All Time Player 01')).toBeInTheDocument();
  expect(screen.queryByText('All Time Player 11')).not.toBeInTheDocument();
});
