import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../Contexts/AppContext';
import ReportMatchComponent from './ReportMatch';

const appContext = {
  activePlayers: [
    { id: 1, first_name: 'Liam', last_name: 'Zhang', sex: 'M' },
    { id: 2, first_name: 'Allison', last_name: 'Cheng', sex: 'F' },
    { id: 3, first_name: 'Daniel', last_name: 'Hu', sex: 'M' },
    { id: 4, first_name: 'Katie', last_name: 'Lau', sex: 'F' },
  ],
  categories: [{ name: 'Practice' }, { name: 'Ranked' }],
};

test('report match tabs render as a segmented control and switch forms', async () => {
  const { container } = render(
    <AppContext.Provider value={appContext}>
      <ReportMatchComponent />
    </AppContext.Provider>
  );

  const tabs = container.querySelector('.report-tabs');
  expect(tabs).toHaveClass('tab-control');

  const singlesTab = screen.getByRole('button', { name: 'Singles' });
  const doublesTab = screen.getByRole('button', { name: 'Doubles' });
  const mixedTab = screen.getByRole('button', { name: 'Mixed' });

  expect(singlesTab).toHaveClass('is-active');
  expect(doublesTab).not.toHaveClass('is-active');
  expect(mixedTab).not.toHaveClass('is-active');
  expect(screen.getAllByText('PLAYER ONE').length).toBeGreaterThan(0);

  await userEvent.click(doublesTab);

  expect(doublesTab).toHaveClass('is-active');
  expect(singlesTab).not.toHaveClass('is-active');
  expect(screen.getAllByText('TEAM ONE').length).toBeGreaterThan(0);

  await userEvent.click(mixedTab);

  expect(mixedTab).toHaveClass('is-active');
  expect(doublesTab).not.toHaveClass('is-active');
  expect(screen.getAllByText('Male').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Female').length).toBeGreaterThan(0);
});
