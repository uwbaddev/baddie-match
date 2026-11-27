import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../../../Contexts/AppContext';
import ReportMatchComponent from '../../../v2/components/ReportMatch';

const appContext = {
  activePlayers: [
    { id: 1, first_name: 'Liam', last_name: 'Zhang', sex: 'M' },
    { id: 2, first_name: 'Allison', last_name: 'Cheng', sex: 'F' },
    { id: 3, first_name: 'Daniel', last_name: 'Hu', sex: 'M' },
    { id: 4, first_name: 'Katie', last_name: 'Lau', sex: 'F' },
  ],
  categories: [{ name: 'Practice' }, { name: 'Ranked' }],
};

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

const renderReport = () => render(
  <AppContext.Provider value={appContext}>
    <ReportMatchComponent />
  </AppContext.Provider>
);

const selectPlayer = (label, id) => {
  const player = appContext.activePlayers.find(player => player.id === id);
  userEvent.click(screen.getByRole('combobox', { name: label }));
  userEvent.click(screen.getByRole('option', { name: `${player.first_name} ${player.last_name}`, exact: true }));
};

const selectSingles = () => {
  selectPlayer('Player one', 1);
  selectPlayer('Player two', 2);
};

const enterScore = (side, game, value) => {
  fireEvent.change(screen.getByRole('spinbutton', { name: `${side}, Game ${game} score` }), { target: { value: String(value) } });
};

test('report match tabs render as a segmented control and switch forms', async () => {
  const { container } = render(
    <AppContext.Provider value={appContext}>
      <ReportMatchComponent />
    </AppContext.Provider>
  );

  const tabs = container.querySelector('.report-tabs');
  expect(tabs).toHaveAttribute('role', 'group');

  const singlesTab = screen.getByRole('button', { name: 'Singles' });
  const doublesTab = screen.getByRole('button', { name: 'Doubles' });
  const mixedTab = screen.getByRole('button', { name: 'Mixed' });
  expect(doublesTab.querySelector('svg')).toHaveClass('lucide-users-round');
  expect(mixedTab.querySelector('svg')).toHaveClass('lucide-users-round');

  expect(singlesTab).toHaveClass('is-active');
  expect(doublesTab).not.toHaveClass('is-active');
  expect(mixedTab).not.toHaveClass('is-active');
  expect(singlesTab).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('combobox', { name: 'Player one' })).toBeInTheDocument();

  await userEvent.click(doublesTab);

  expect(doublesTab).toHaveClass('is-active');
  expect(singlesTab).not.toHaveClass('is-active');
  expect(screen.getByRole('combobox', { name: 'Team one, Player 1' })).toBeInTheDocument();

  await userEvent.click(mixedTab);

  expect(mixedTab).toHaveClass('is-active');
  expect(doublesTab).not.toHaveClass('is-active');
  expect(screen.getAllByText('Male').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Female').length).toBeGreaterThan(0);
});

test('selected names appear beside scores and cannot be selected on the other side', () => {
  const { container } = renderReport();
  selectSingles();
  const scoreNames = container.querySelectorAll('.report-score-player');
  expect(scoreNames[0]).toHaveTextContent('Liam Zhang');
  expect(scoreNames[1]).toHaveTextContent('Allison Cheng');
  userEvent.click(screen.getByRole('combobox', { name: 'Player two' }));
  expect(screen.getByRole('option', { name: 'Liam Zhang Already selected' })).toHaveAttribute('aria-disabled', 'true');
  expect(container.querySelector('.report-side-marker')).not.toBeInTheDocument();
  expect(container.querySelector('.report-score-player img')).not.toBeInTheDocument();
  expect(screen.queryByText('Side')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Score', level: 2 })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /01|02/ })).not.toBeInTheDocument();
});

test('mixed player selectors preserve male and female choices', async () => {
  renderReport();
  await userEvent.click(screen.getByRole('button', { name: 'Mixed' }));
  const male = screen.getByRole('combobox', { name: 'Team one, Male' });
  const female = screen.getByRole('combobox', { name: 'Team one, Female' });
  userEvent.click(male);
  expect(screen.getByRole('option', { name: 'Liam Zhang' })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: 'Allison Cheng' })).not.toBeInTheDocument();
  userEvent.click(female);
  expect(screen.getByRole('option', { name: 'Allison Cheng' })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: 'Liam Zhang' })).not.toBeInTheDocument();
});

test('singles submission keeps the API score ordering and resets after success', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('Match was added') });
  renderReport();
  selectSingles();
  enterScore('Player one', 1, 21);
  enterScore('Player two', 1, 15);
  enterScore('Player one', 2, 22);
  enterScore('Player two', 2, 20);
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Match submitted.'));
  expect(global.fetch).toHaveBeenCalledTimes(1);
  const options = global.fetch.mock.calls[0][1];
  expect(options.method).toBe('POST');
  expect(JSON.parse(options.body)).toEqual({ event: 'Singles', player1Id: 1, player2Id: 2, score: [21, 15, 22, 20, 0, 0], category: 'Ranked' });
  expect(screen.getByRole('combobox', { name: 'Player one' })).toHaveValue('');
  expect(screen.getByRole('spinbutton', { name: 'Player one, Game 1 score' })).toHaveValue(null);
  expect(screen.getByRole('radio', { name: 'Ranked' })).toBeChecked();
});

test.each(['Doubles', 'Mixed'])('%s submits four players in their team positions', async (event) => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('Match was added') });
  renderReport();
  await userEvent.click(screen.getByRole('button', { name: event }));
  const labels = event === 'Mixed' ? ['Male', 'Female'] : ['Player 1', 'Player 2'];
  ['one', 'two'].forEach((side, index) => labels.forEach((label, slot) => {
    selectPlayer(`Team ${side}, ${label}`, index * 2 + slot + 1);
  }));
  enterScore('Team one', 1, 21);
  enterScore('Team two', 1, 18);
  await userEvent.click(screen.getByRole('radio', { name: 'Practice' }));
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({ event, player1Id: 1, player2Id: 2, player3Id: 3, player4Id: 4, score: [21, 18, 0, 0, 0, 0], category: 'Practice' });
  await screen.findByRole('status');
});

test('incomplete entries display clear validation without making a request', async () => {
  global.fetch = jest.fn();
  renderReport();
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Select a player for every position.');
  selectSingles();
  enterScore('Player one', 1, 21);
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter both scores for Game 1.');
  enterScore('Player two', 1, 15);
  enterScore('Player one', 2, 21);
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter both scores for Game 2.');
  expect(global.fetch).not.toHaveBeenCalled();
});

test('a failed submission keeps the entered values and displays the server error', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, text: () => Promise.resolve('Database unavailable') });
  renderReport();
  selectSingles();
  enterScore('Player one', 1, 21);
  enterScore('Player two', 1, 15);
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Database unavailable'));
  expect(screen.getByRole('combobox', { name: 'Player one' })).toHaveValue('Liam Zhang');
  expect(screen.getByRole('spinbutton', { name: 'Player one, Game 1 score' })).toHaveValue(21);
});

test.each([
  { games: [2, 3], message: 'Enter both scores for Game 1.' },
  { games: [1, 3], message: 'Enter Game 2 before Game 3.' },
])('rejects skipped games: $games', async ({ games, message }) => {
  global.fetch = jest.fn();
  renderReport();
  selectSingles();
  games.forEach(game => {
    enterScore('Player one', game, 21);
    enterScore('Player two', game, 15);
  });
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  expect(screen.getByRole('alert')).toHaveTextContent(message);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('zero-zero cannot disguise a skipped game', async () => {
  global.fetch = jest.fn();
  renderReport();
  selectSingles();
  [1, 3].forEach(game => {
    enterScore('Player one', game, 21);
    enterScore('Player two', game, 0);
  });
  enterScore('Player one', 2, 0);
  enterScore('Player two', 2, 0);
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter Game 2 before Game 3.');
  expect(global.fetch).not.toHaveBeenCalled();
});

test('allows consecutive games and a genuine zero score', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('Match was added') });
  renderReport();
  selectSingles();
  [1, 2, 3].forEach(game => {
    enterScore('Player one', game, 21);
    enterScore('Player two', game, 0);
  });
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  await screen.findByRole('status');
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).score).toEqual([21, 0, 21, 0, 21, 0]);
});

test('clear form resets the entered values', async () => {
  renderReport();
  selectSingles();
  enterScore('Player one', 1, 21);
  await userEvent.click(screen.getByRole('radio', { name: 'Practice' }));
  await userEvent.click(screen.getByRole('button', { name: 'Clear form' }));
  expect(screen.getByRole('combobox', { name: 'Player one' })).toHaveValue('');
  expect(screen.getByRole('spinbutton', { name: 'Player one, Game 1 score' })).toHaveValue(null);
  expect(screen.getByRole('radio', { name: 'Ranked' })).toBeChecked();
});

test('an in-flight submission disables repeat submissions and switching match types', async () => {
  let finishRequest;
  global.fetch = jest.fn(() => new Promise(resolve => { finishRequest = resolve; }));
  renderReport();
  selectSingles();
  enterScore('Player one', 1, 21);
  enterScore('Player two', 1, 18);
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  const submitting = screen.getByRole('button', { name: 'Submitting' });
  expect(submitting).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Mixed' })).toBeDisabled();
  expect(screen.getByRole('combobox', { name: 'Player one' })).toBeDisabled();
  expect(screen.getByRole('radio', { name: 'Practice' })).toBeDisabled();
  await userEvent.click(submitting);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  await act(async () => {
    finishRequest({ ok: true, text: () => Promise.resolve('Match was added') });
  });
  expect(screen.getByRole('status')).toHaveTextContent('Match submitted.');
});

test('category toggle defaults to Ranked and allows selecting Practice', async () => {
  renderReport();
  expect(screen.getByRole('radiogroup', { name: 'Category' })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: 'Ranked' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Practice' })).not.toBeChecked();
  await userEvent.click(screen.getByRole('radio', { name: 'Practice' }));
  expect(screen.getByRole('radio', { name: 'Practice' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Ranked' })).not.toBeChecked();
});

test('default Ranked resolves to the database category after categories load', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('Match was added') });
  const { rerender } = render(
    <AppContext.Provider value={{ ...appContext, categories: [] }}><ReportMatchComponent /></AppContext.Provider>
  );
  expect(screen.getByRole('radio', { name: 'Ranked' })).toBeChecked();
  rerender(
    <AppContext.Provider value={{ ...appContext, categories: [{ name: 't_practice' }, { name: 't_ranked' }] }}><ReportMatchComponent /></AppContext.Provider>
  );
  selectSingles();
  enterScore('Player one', 1, 21);
  enterScore('Player two', 1, 18);
  await userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  await screen.findByRole('status');
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).category).toBe('t_ranked');
});

test('player search matches last names case-insensitively and supports keyboard selection', () => {
  global.fetch = jest.fn();
  renderReport();
  const input = screen.getByRole('combobox', { name: 'Player one' });
  userEvent.type(input, ' zHaNg ');
  expect(screen.getAllByRole('option')).toHaveLength(1);
  expect(screen.getByRole('option', { name: 'Liam Zhang' })).toBeInTheDocument();
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(input).toHaveAttribute('aria-activedescendant', 'report-player-0-option-1');
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(input).toHaveValue('Liam Zhang');
  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('an unfinished search clears the old player ID and cannot be submitted', () => {
  global.fetch = jest.fn();
  renderReport();
  selectSingles();
  const input = screen.getByRole('combobox', { name: 'Player one' });
  userEvent.type(input, 'Nobody');
  expect(screen.getByRole('status')).toHaveTextContent('No players found.');
  userEvent.click(screen.getByRole('button', { name: 'Submit match' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Select a player for every position.');
  expect(input).toHaveValue('');
  expect(global.fetch).not.toHaveBeenCalled();
});

test('player search closes on Escape and blur and can clear a selected player', () => {
  renderReport();
  selectSingles();
  const input = screen.getByRole('combobox', { name: 'Player one' });
  userEvent.click(input);
  fireEvent.keyDown(input, { key: 'Escape' });
  expect(input).toHaveValue('Liam Zhang');
  expect(input).toHaveAttribute('aria-expanded', 'false');
  userEvent.click(input);
  userEvent.click(screen.getByRole('heading', { name: 'Score' }));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'Clear player one' }));
  expect(input).toHaveValue('');
  expect(input).toHaveFocus();
  userEvent.tab();
  expect(input).toHaveAttribute('aria-expanded', 'false');
});

test('already-selected players cannot be chosen by mouse or keyboard', () => {
  renderReport();
  selectPlayer('Player one', 1);
  const input = screen.getByRole('combobox', { name: 'Player two' });
  userEvent.type(input, 'Liam');
  userEvent.click(screen.getByRole('option', { name: 'Liam Zhang Already selected' }));
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(input).toHaveValue('Liam');
  expect(input).not.toHaveAttribute('aria-activedescendant');
  userEvent.clear(input);
  fireEvent.keyDown(input, { key: 'ArrowUp' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(input).toHaveValue('Katie Lau');
  expect(screen.getByRole('combobox', { name: 'Player one' })).toHaveValue('Liam Zhang');
});

test('an empty player list supports searching without selecting an invalid player', () => {
  render(
    <AppContext.Provider value={{ ...appContext, activePlayers: [] }}><ReportMatchComponent /></AppContext.Provider>
  );
  const input = screen.getByRole('combobox', { name: 'Player one' });
  userEvent.type(input, 'Liam');
  fireEvent.keyDown(input, { key: 'ArrowUp' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(screen.getByRole('status')).toHaveTextContent('No players found.');
  expect(screen.queryByRole('option')).not.toBeInTheDocument();
});

test('tabbing back to a selected player and pressing Enter preserves that player', () => {
  global.fetch = jest.fn();
  renderReport();
  selectSingles();
  userEvent.tab({ shift: true });
  userEvent.tab({ shift: true });
  const input = screen.getByRole('combobox', { name: 'Player one' });
  expect(input).toHaveFocus();
  expect(input).toHaveValue('Liam Zhang');
  expect(input).toHaveAttribute('aria-activedescendant', 'report-player-0-option-1');
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(input).toHaveValue('Liam Zhang');
  expect(screen.getByRole('combobox', { name: 'Player two' })).toHaveValue('Allison Cheng');
  expect(global.fetch).not.toHaveBeenCalled();
});

test('Enter does not select an unhighlighted player after clearing the field', () => {
  renderReport();
  selectSingles();
  userEvent.click(screen.getByRole('button', { name: 'Clear player one' }));
  const input = screen.getByRole('combobox', { name: 'Player one' });
  expect(input).not.toHaveAttribute('aria-activedescendant');
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(input).toHaveValue('');
});
