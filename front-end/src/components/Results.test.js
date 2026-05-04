import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../Contexts/AppContext';
import ResultsPage from './Results';

const renderResults = (queryMatchPage) => {
  render(
    <AppContext.Provider
      value={{
        players: [{ id: 1, first_name: 'Allison', last_name: 'Cheng' }],
        queryMatchPage,
      }}
    >
      <ResultsPage />
    </AppContext.Provider>
  );
};

const resolvePage = (page) => new Promise(resolve => {
  setTimeout(() => resolve(page), 0);
});

const getNumberedPageButtons = () => Array.from(
  screen.getByLabelText('Results pages').querySelectorAll('button:not([aria-label])')
);

test('results season dropdown does not include 2024-2025 and keeps all time', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '51',
      recordsPerPage: '50',
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
      recordsPerPage: '50',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await waitFor(() => expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument());
  expect(screen.getByLabelText('Results pages')).toHaveClass('results-pagination');
  expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '1' })).toHaveClass('is-active');
  expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
});

test('results caps visible page numbers at five for long result sets', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '1150',
      recordsPerPage: '50',
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
      recordsPerPage: '50',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await screen.findByRole('button', { name: '5' });
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    2,
    50,
    '2025-09-01',
    '2026-08-31',
  ));
  expect(getNumberedPageButtons().map(button => button.textContent)).toEqual(['1', '2', '3', '4', '5']);

  await userEvent.click(screen.getByRole('button', { name: '5' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    5,
    50,
    '2025-09-01',
    '2026-08-31',
  ));
  expect(getNumberedPageButtons().map(button => button.textContent)).toEqual(['3', '4', '5', '6', '7']);
});

test('results pagination shows the final five-page window near the end', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '1150',
      recordsPerPage: '50',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await screen.findByRole('button', { name: '5' });
  await userEvent.click(screen.getByRole('button', { name: 'Last page' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    23,
    50,
    '2025-09-01',
    '2026-08-31',
  ));
  expect(getNumberedPageButtons().map(button => button.textContent)).toEqual(['19', '20', '21', '22', '23']);
});

test('clicking a results page fetches that page', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '125',
      recordsPerPage: '50',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await waitFor(() => expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument());
  await userEvent.click(screen.getByRole('button', { name: '3' }));

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    3,
    50,
    '2025-09-01',
    '2026-08-31',
  ));
  expect(screen.getByRole('button', { name: '3' })).toHaveClass('is-active');
});

test('changing results season resets pagination to page one', async () => {
  const queryMatchPage = jest.fn(() => resolvePage({
    metadata: {
      recordCount: '125',
      recordsPerPage: '50',
    },
    records: [],
  }));

  renderResults(queryMatchPage);

  await waitFor(() => expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument());
  await userEvent.click(screen.getByRole('button', { name: '3' }));
  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    3,
    50,
    '2025-09-01',
    '2026-08-31',
  ));

  await userEvent.selectOptions(screen.getAllByRole('combobox')[0], '2000-09-01,3000-09-01');

  await waitFor(() => expect(queryMatchPage).toHaveBeenLastCalledWith(
    1,
    50,
    '2000-09-01',
    '3000-09-01',
  ));
});
