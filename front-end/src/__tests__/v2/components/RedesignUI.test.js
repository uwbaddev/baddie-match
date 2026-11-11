import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MatchCard, NamePill, PlayerAvatar, ProfileEloCard, SeasonSelect } from '../../../v2/components/RedesignUI';

test('cached avatars use lazy loading and fall back to initials on image failure', () => {
  render(<PlayerAvatar player={{ name: 'Jessica Cheng' }} />);
  const image = screen.getByRole('img', { name: 'Jessica Cheng' });
  expect(image.src).toContain('jessica-viyan-cheng');
  expect(image.src).not.toContain('/api/');
  expect(image).toHaveAttribute('loading', 'lazy');
  expect(image).toHaveAttribute('decoding', 'async');
  fireEvent.error(image);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.getByText('JC')).toBeInTheDocument();
});

test('NamePill can render a linked player name', () => {
  render(
    <MemoryRouter>
      <NamePill to="/players/7">Ada Wong</NamePill>
    </MemoryRouter>
  );

  expect(screen.getByRole('link', { name: 'Ada Wong' })).toHaveAttribute('href', '/players/7');
});

test('ProfileEloCard shows the group label and promotion spot without mu or sigma', () => {
  render(
    <ProfileEloCard
      card={{ label: 'Singles Elo', groupLabel: 'Group 2', promotion: true, placing: false, games: 11, winPct: 55 }}
    />
  );

  expect(screen.getByText('Group 2')).toBeInTheDocument();
  expect(screen.getByText(/Promotion spot/)).toBeInTheDocument();
  expect(screen.getByText('Games')).toBeInTheDocument();
  expect(screen.getByText('Win %')).toBeInTheDocument();
  expect(screen.queryByText('μ')).not.toBeInTheDocument();
  expect(screen.queryByText('σ')).not.toBeInTheDocument();
});

test('ProfileEloCard shows a podium medal for the top three', () => {
  render(
    <ProfileEloCard
      card={{ label: 'Singles Elo', groupLabel: 'Group 1', podium: 2, promotion: false, placing: false, games: 20, winPct: 70 }}
    />
  );

  expect(screen.getByText('2nd')).toHaveClass('podium-badge', 'podium-2');
  expect(screen.queryByText(/Promotion spot/)).not.toBeInTheDocument();
});

test('ProfileEloCard shows placement progress for players getting placed', () => {
  render(
    <ProfileEloCard
      card={{ label: 'Doubles Elo', placing: true, placementGames: 8, games: 3, winPct: 33 }}
    />
  );

  expect(screen.getByText('Getting placed')).toBeInTheDocument();
  expect(screen.getByText('3 / 8')).toBeInTheDocument();
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
});

test('SeasonSelect removes the 2024-2025 season option but keeps All', () => {
  render(<SeasonSelect value="2025-09-01,2026-08-31" onChange={() => {}} />);

  expect(screen.getByRole('option', { name: '2025 - 2026' })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: '2024 - 2025' })).not.toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'ALL' })).toBeInTheDocument();
});

test('MatchCard renders linked player names with one winner dot', () => {
  const { container } = render(
    <MemoryRouter>
      <MatchCard
        match={{
          time: '7:00 AM',
          dateTimeLabel: 'Fri Sep 19, 2025 · 7:00 AM',
          event: 'Doubles',
          category: 'Ranked',
          teamOne: 'Ada Wong / Ben Singh',
          teamTwo: 'Cyd Tran / Dee Kim',
          teamOnePlayers: [
            { id: 1, name: 'Ada Wong', to: '/players/1' },
            { id: 2, name: 'Ben Singh', to: '/players/2' },
          ],
          teamTwoPlayers: [
            { id: 3, name: 'Cyd Tran', to: '/players/3' },
            { id: 4, name: 'Dee Kim', to: '/players/4' },
          ],
          teamOneWon: false,
          teamTwoWon: true,
          winningSide: 'teamTwo',
          sets: [
            { teamOne: 21, teamTwo: 15 },
            { teamOne: 18, teamTwo: 21 },
            { teamOne: 19, teamTwo: 21 },
          ],
        }}
      />
    </MemoryRouter>
  );

  expect(screen.getByRole('link', { name: 'Ada Wong' })).toHaveAttribute('href', '/players/1');
  expect(screen.getByRole('link', { name: 'Ben Singh' })).toHaveAttribute('href', '/players/2');
  expect(screen.getByText('7:00 AM')).toBeInTheDocument();
  expect(screen.queryByText('Fri Sep 19, 2025 · 7:00 AM')).not.toBeInTheDocument();
  expect(screen.getAllByText('/')).toHaveLength(2);
  expect(container.querySelectorAll('.score-dot')).toHaveLength(1);
  expect(container.querySelector('.match-team.is-winner .score-dot')).toBeInTheDocument();
  const rows = container.querySelectorAll('.match-team');
  expect(rows[0]).toHaveClass('match-team');
  expect(rows[0]).not.toHaveClass('is-winner');
  expect(rows[1]).toHaveClass('match-team', 'is-winner');
  expect(rows[0].querySelectorAll('.set-score.is-winning')).toHaveLength(1);
  expect(rows[0].querySelectorAll('.set-score')[0]).toHaveClass('is-winning');
  expect(rows[0].querySelectorAll('.set-score')[1]).not.toHaveClass('is-winning');
  expect(rows[0].querySelectorAll('.set-score')[2]).not.toHaveClass('is-winning');
  expect(rows[1].querySelectorAll('.set-score.is-winning')).toHaveLength(2);
  expect(rows[1].querySelectorAll('.set-score')[0]).not.toHaveClass('is-winning');
  expect(rows[1].querySelectorAll('.set-score')[1]).toHaveClass('is-winning');
  expect(rows[1].querySelectorAll('.set-score')[2]).toHaveClass('is-winning');
});

test('MatchCard keeps losing set scores normal even on the winning row', () => {
  const { container } = render(
    <MemoryRouter>
      <MatchCard
        match={{
          time: '4:26 PM',
          event: 'Doubles',
          category: 'Ranked',
          teamOne: 'Jacob Kim / Andrew Zhuang',
          teamTwo: 'Michael Ji / Brad Enns',
          teamOnePlayers: [
            { id: 1, name: 'Jacob Kim', to: '/players/1' },
            { id: 2, name: 'Andrew Zhuang', to: '/players/2' },
          ],
          teamTwoPlayers: [
            { id: 3, name: 'Michael Ji', to: '/players/3' },
            { id: 4, name: 'Brad Enns', to: '/players/4' },
          ],
          teamOneWon: true,
          teamTwoWon: false,
          winningSide: 'teamOne',
          sets: [
            { teamOne: 18, teamTwo: 21 },
            { teamOne: 21, teamTwo: 15 },
          ],
        }}
      />
    </MemoryRouter>
  );

  const winningRowScores = container.querySelectorAll('.match-team.is-winner .set-score');
  expect(winningRowScores[0]).not.toHaveClass('is-winning');
  expect(winningRowScores[1]).toHaveClass('is-winning');
});

test('MatchCard does not render a winner dot for tied matches', () => {
  const { container } = render(
    <MemoryRouter>
      <MatchCard
        match={{
          time: '7:00 AM',
          event: 'Singles',
          category: 'Practice',
          teamOne: 'Ada Wong',
          teamTwo: 'Ben Singh',
          teamOnePlayers: [{ id: 1, name: 'Ada Wong', to: '/players/1' }],
          teamTwoPlayers: [{ id: 2, name: 'Ben Singh', to: '/players/2' }],
          teamOneWon: false,
          teamTwoWon: false,
          winningSide: null,
          sets: [
            { teamOne: 21, teamTwo: 19 },
            { teamOne: 19, teamTwo: 21 },
          ],
        }}
      />
    </MemoryRouter>
  );

  expect(container.querySelector('.score-dot')).not.toBeInTheDocument();
});
