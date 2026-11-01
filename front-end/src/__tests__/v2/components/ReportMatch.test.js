import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

const selectSingles = () => {
  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Player one' }), '1');
  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Player two' }), '2');
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
  expect(within(screen.getByRole('combobox', { name: 'Player two' })).getByRole('option', { name: 'Liam Zhang' })).toBeDisabled();
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
  expect(within(male).getByRole('option', { name: 'Liam Zhang' })).toBeInTheDocument();
  expect(within(male).queryByRole('option', { name: 'Allison Cheng' })).not.toBeInTheDocument();
  expect(within(female).getByRole('option', { name: 'Allison Cheng' })).toBeInTheDocument();
  expect(within(female).queryByRole('option', { name: 'Liam Zhang' })).not.toBeInTheDocument();
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
    userEvent.selectOptions(screen.getByRole('combobox', { name: `Team ${side}, ${label}` }), String(index * 2 + slot + 1));
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
  expect(screen.getByRole('combobox', { name: 'Player one' })).toHaveValue('1');
  expect(screen.getByRole('spinbutton', { name: 'Player one, Game 1 score' })).toHaveValue(21);
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
