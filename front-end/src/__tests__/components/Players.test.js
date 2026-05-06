import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../../Contexts/AppContext';
import Players from '../../components/Players';

const renderPlayers = () => render(
  <MemoryRouter>
    <AppContext.Provider value={{ players: [] }}>
      <Players />
    </AppContext.Provider>
  </MemoryRouter>
);

test('defaults roster to 2025-26 and links official player cards', () => {
  renderPlayers();

  expect(screen.getByRole('combobox')).toHaveValue('2025-26');
  expect(screen.getByText('Liam Zhang')).toBeInTheDocument();
  expect(screen.getByText('Liam Zhang').closest('a')).toHaveAttribute('href', '/players/2025-26/liam-zhang');
});

test('switches roster seasons from the dropdown', async () => {
  renderPlayers();

  await userEvent.selectOptions(screen.getByRole('combobox'), '2024-25');

  expect(screen.getByText('Allison Cheng')).toBeInTheDocument();
  expect(screen.getByText('Allison Cheng').closest('a')).toHaveAttribute('href', '/players/2024-25/allison-cheng');
  expect(screen.getByText('Darren Choi')).toBeInTheDocument();
  expect(screen.getByText('Darren Choi').closest('a')).toHaveAttribute('href', '/players/2024-25/darren-choi');

  await userEvent.selectOptions(screen.getByRole('combobox'), '2023-24');

  expect(screen.getByText('Tom Guo')).toBeInTheDocument();
  expect(screen.queryByText('Liam Zhang')).not.toBeInTheDocument();
});

test('keeps player roster cards simple while preserving staff roles', async () => {
  renderPlayers();

  expect(screen.getByText('Liam Zhang')).toBeInTheDocument();
  expect(screen.queryByText('Computer Engineering')).not.toBeInTheDocument();
  expect(screen.queryByText('Second Year')).not.toBeInTheDocument();
  expect(screen.getByText('Andrew Zhuang')).toBeInTheDocument();
  expect(screen.getByText('Andrew Zhuang').closest('a')).toHaveAttribute('href', '/players/2025-26/andrew-zhuang');
  expect(screen.getByText('Head Coach')).toBeInTheDocument();
  expect(screen.getByText('Ivan Cheng')).toBeInTheDocument();
  expect(screen.getByText('Ivan Cheng').closest('a')).toHaveAttribute('href', '/players/2025-26/ivan-cheng');
  expect(screen.getByText('Thomas Dent')).toBeInTheDocument();
  expect(screen.getByText('Brad Enns')).toBeInTheDocument();
  expect(screen.getAllByText('Assistant Coach')).toHaveLength(3);
  expect(screen.getByText('Teresa Trinh')).toBeInTheDocument();
  expect(screen.getByText('Teresa Trinh').closest('a')).toBeNull();
  expect(screen.getByText('Mathura Murugesan')).toBeInTheDocument();
  expect(screen.getByText('Mathura Murugesan').closest('a')).toBeNull();
  expect(screen.getAllByText('Team Manager')).toHaveLength(2);
  expect(screen.getByText('Alexis Boyd')).toBeInTheDocument();
  expect(screen.getByText('Alexis Boyd').closest('a')).toBeNull();
  expect(screen.getByText('Genah Nieto')).toBeInTheDocument();
  expect(screen.getByText('Matt Anderson')).toBeInTheDocument();
  expect(screen.getAllByText('Student Athletic Therapist')).toHaveLength(3);

  await userEvent.selectOptions(screen.getByRole('combobox'), '2024-25');

  expect(screen.getByText('Andrew Zhuang')).toBeInTheDocument();
  expect(screen.getByText('Head Coach')).toBeInTheDocument();
});
