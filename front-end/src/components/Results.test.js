import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../Contexts/AppContext';
import ResultsPage from './Results';

const renderResults = (queryMatchPage) => {
  render(
    <MemoryRouter>
      <AppContext.Provider
        value={{
          players: [{ id: 1, first_name: 'Allison', last_name: 'Cheng' }],
          queryMatchPage,
        }}
      >
        <ResultsPage />
      </AppContext.Provider>
    </MemoryRouter>
  );
};

const resolvePage = (page) => new Promise(resolve => {
  setTimeout(() => resolve(page), 0);
});

const getNumberedPageButtons = () => Array.from(
  screen.getByLabelText('Results pages top').querySelectorAll('button:not([aria-label])')
);

const makeMatch = (id, lastEdit = '2025-09-10-12:00:00') => ({
  id,
  event: 'Singles',
  category: 'ranked',
  players: [1, 2],
  winners: [1],
  score: [21, 15, 21, 16, 0, 0],
  date_added: lastEdit,
  last_edit: lastEdit,
});

test('results season dropdown does not include 2024-2025 and keeps all time', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '51',
      pageCount: '3',
      recordsPerPage: '20',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await screen.findByRole('button', { name: '2' });
  expect(queryMatchPage).toHaveBeenCalled();
  expect(screen.queryByRole('option', { name: '2024 - 2025' })).not.toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'ALL' })).toBeInTheDocument();
});

test('results renders numbered pagination from the selected time period count', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '225',
      pageCount: '5',
      recordsPerPage: '20',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await waitFor(() => expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument());
  expect(screen.getByLabelText('Results pages top')).toHaveClass('results-pagination');
  expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '1' })).toHaveClass('is-active');
  expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
});

test('results caps visible page numbers at five for long result sets', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '1150',
      pageCount: '23',
      recordsPerPage: '20',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await screen.findByRole('button', { name: '5' });
  expect(getNumberedPageButtons().map(button => button.textContent)).toEqual(['1', '2', '3', '4', '5']);
  expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
});

test('results pagination uses a sliding five-page window', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '1150',
      pageCount: '23',
      recordsPerPage: '20',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await screen.findByRole('button', { name: '5' });
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    2,
    20,
    '2025-09-01',
    '2026-08-31',
    'all',
  ));
  expect(getNumberedPageButtons().map(button => button.textContent)).toEqual(['1', '2', '3', '4', '5']);

  await userEvent.click(screen.getByRole('button', { name: '5' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    5,
    20,
    '2025-09-01',
    '2026-08-31',
    'all',
  ));
  expect(getNumberedPageButtons().map(button => button.textContent)).toEqual(['3', '4', '5', '6', '7']);
});

test('results pagination shows the final five-page window near the end', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '1150',
      pageCount: '23',
      recordsPerPage: '20',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await screen.findByRole('button', { name: '5' });
  await userEvent.click(screen.getByRole('button', { name: 'Last page' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    23,
    20,
    '2025-09-01',
    '2026-08-31',
    'all',
  ));
  expect(getNumberedPageButtons().map(button => button.textContent)).toEqual(['19', '20', '21', '22', '23']);
});

test('clicking a results page fetches that page', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '125',
      pageCount: '7',
      recordsPerPage: '20',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await waitFor(() => expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument());
  await userEvent.click(screen.getByRole('button', { name: '3' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    3,
    20,
    '2025-09-01',
    '2026-08-31',
    'all',
  ));
  expect(screen.getByRole('button', { name: '3' })).toHaveClass('is-active');
});

test('changing results season resets pagination to page one', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '125',
      pageCount: '7',
      recordsPerPage: '20',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await waitFor(() => expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument());
  await userEvent.click(screen.getByRole('button', { name: '3' }));
  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    3,
    20,
    '2025-09-01',
    '2026-08-31',
    'all',
  ));

  await userEvent.selectOptions(screen.getAllByRole('combobox')[0], '2000-09-01,3000-09-01');

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    1,
    20,
    '2000-09-01',
    '3000-09-01',
    'all',
  ));
});

test('changing results event filter resets pagination to page one and refetches that event', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '125',
      pageCount: '7',
      recordsPerPage: '20',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await waitFor(() => expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument());
  await userEvent.click(screen.getByRole('button', { name: '3' }));
  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    3,
    20,
    '2025-09-01',
    '2026-08-31',
    'all',
  ));

  await userEvent.selectOptions(screen.getAllByRole('combobox')[1], 'singles');

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    1,
    20,
    '2025-09-01',
    '2026-08-31',
    'singles',
  ));
});

test('results renders pagination above and below populated match lists', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '42',
      pageCount: '3',
      recordsPerPage: '20',
    },
    records: [makeMatch(1)],
  }));

  renderResults(queryMatchPage);

  await screen.findByText('WED SEP 10, 2025');
  expect(screen.getByLabelText('Results pages top')).toHaveClass('results-pagination');
  expect(screen.getByLabelText('Results pages bottom')).toHaveClass('results-pagination');

  await userEvent.click(within(screen.getByLabelText('Results pages bottom')).getByRole('button', { name: '2' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    2,
    20,
    '2025-09-01',
    '2026-08-31',
    'all',
  ));
});
