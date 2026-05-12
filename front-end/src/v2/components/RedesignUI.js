import { Link } from 'react-router-dom';
import {
  getAvatarTheme,
  getInitials,
  formatPlayerName,
  SEASON_OPTIONS,
  parseSeasonValue,
} from '../utils/playerViewModels';
import { getRosterPlayerAvatar } from '../utils/rosterData';

export const PageShell = ({ title, eyebrow, actions, children, className = '' }) => (
  <main className={`page-shell v2-site ${className}`}>
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {eyebrow && <p>{eyebrow}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
    {children}
  </main>
);

export const TabControl = ({ tabs, active, onChange, className = '' }) => (
  <div className={`tab-control ${className}`} role="tablist">
    {tabs.map(tab => (
      <button
        key={tab.key}
        type="button"
        className={active === tab.key ? 'is-active' : ''}
        onClick={() => onChange(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const SeasonSelect = ({ value, onChange, className = '' }) => (
  <select
    className={`filter-select ${className}`}
    value={value}
    onChange={(event) => onChange(event.target.value, parseSeasonValue(event.target.value))}
  >
    {SEASON_OPTIONS.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

const MAX_VISIBLE_PAGES = 5;

export const getVisiblePages = (currentPage, pageCount, maxVisiblePages = MAX_VISIBLE_PAGES) => {
  const visibleCount = Math.min(pageCount, maxVisiblePages);
  const halfWindow = Math.floor(visibleCount / 2);
  let startPage = currentPage - halfWindow;

  if (startPage < 1) {
    startPage = 1;
  }

  if (startPage + visibleCount - 1 > pageCount) {
    startPage = pageCount - visibleCount + 1;
  }

  return Array.from({ length: visibleCount }, (_, index) => startPage + index);
};

export const PaginationControl = ({ currentPage, pageCount, onPageChange, label = 'Results pages' }) => {
  if (pageCount <= 1) return null;

  const pages = getVisiblePages(currentPage, pageCount);
  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), pageCount);
    if (nextPage !== currentPage) onPageChange(nextPage);
  };

  return (
    <nav className="results-pagination" aria-label={label}>
      <button
        type="button"
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        &laquo;
      </button>
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &lsaquo;
      </button>
      {pages.map(page => (
        <button
          key={page}
          type="button"
          className={page === currentPage ? 'is-active' : ''}
          onClick={() => goToPage(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === pageCount}
        aria-label="Next page"
      >
        &rsaquo;
      </button>
      <button
        type="button"
        onClick={() => goToPage(pageCount)}
        disabled={currentPage === pageCount}
        aria-label="Last page"
      >
        &raquo;
      </button>
    </nav>
  );
};

export const PlayerAvatar = ({ player, index = 0, size = 'md' }) => {
  const name = formatPlayerName(player);
  const avatar = player && player.name
    ? getRosterPlayerAvatar(player)
    : { type: player && player.photoUrl ? 'image' : 'initials', src: player && player.photoUrl, initials: getInitials(name) };

  return (
    <div className={`player-avatar ${getAvatarTheme(player, index)} avatar-${size}`}>
      {avatar.type === 'image' ? (
        <img src={avatar.src} alt={name} />
      ) : (
        <span aria-hidden="true">{avatar.initials}</span>
      )}
    </div>
  );
};

export const RankingsTable = ({ columns, rows, emptyMessage = 'Retrieving data, please be patient...' }) => (
  <div className="data-table-wrap">
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(column => <th key={column.key}>{column.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="empty-cell">{emptyMessage}</td>
          </tr>
        ) : rows.map(row => (
          <tr key={row.id || `${row.rank}-${row.name}`}>
            {columns.map(column => (
              <td key={column.key}>
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const NamePill = ({ children, to }) => {
  if (to) {
    return <Link className="name-pill" to={to}>{children}</Link>;
  }

  return <span className="name-pill">{children}</span>;
};

const TeamPlayers = ({ players, fallback }) => {
  if (!players || players.length === 0) return <span>{fallback}</span>;

  return (
    <span className="match-players">
      {players.map((player, index) => (
        <span key={`${player.id || player.name}-${index}`} className="match-player-item">
          {index > 0 && <span className="match-player-separator"> / </span>}
          {player.to ? (
            <Link className="match-player-link" to={player.to}>{player.name}</Link>
          ) : (
            <span>{player.name}</span>
          )}
        </span>
      ))}
    </span>
  );
};

export const MatchCard = ({ match }) => (
  <article className="match-card">
    <div className="match-card-meta">
      <strong>{match.time}</strong>
      <span>{match.event}</span>
      <span>{match.category}</span>
    </div>
    <div className="match-card-body">
      <div className={match.teamOneWon ? 'match-team is-winner' : 'match-team'}>
        <TeamPlayers players={match.teamOnePlayers} fallback={match.teamOne} />
        <ScoreLine sets={match.sets} team="teamOne" showWinnerDot={match.winningSide === 'teamOne'} />
      </div>
      <div className={match.teamTwoWon ? 'match-team is-winner' : 'match-team'}>
        <TeamPlayers players={match.teamTwoPlayers} fallback={match.teamTwo} />
        <ScoreLine sets={match.sets} team="teamTwo" showWinnerDot={match.winningSide === 'teamTwo'} />
      </div>
    </div>
  </article>
);

const ScoreLine = ({ sets, team, showWinnerDot }) => (
  <div className="score-line">
    {showWinnerDot && <span className="score-dot" aria-hidden="true" />}
    {sets.map((set, index) => (
      <span
        key={index}
        className={set[team] > set[team === 'teamOne' ? 'teamTwo' : 'teamOne'] ? 'set-score is-winning' : 'set-score'}
      >
        {set[team]}
      </span>
    ))}
  </div>
);

export const RosterCard = ({ player, index, to, subtitle }) => {
  const content = (
    <>
      <PlayerAvatar player={player} index={index} />
      <span>
        <strong>{formatPlayerName(player)}</strong>
        {subtitle && <em>{subtitle}</em>}
      </span>
    </>
  );

  if (to) {
    return <Link className="roster-card" to={to}>{content}</Link>;
  }
  return <div className="roster-card">{content}</div>;
};

export const StatRing = ({ stat }) => (
  <div className="profile-stat">
    <strong>{stat.label}</strong>
    <div className="profile-stat-row">
      <div
        className="stat-ring"
        style={{
          '--stat-color': stat.color,
          '--stat-value': `${Math.max(0, Math.min(100, stat.winPct))}%`,
        }}
      >
        <span>{stat.winPct}%</span>
        <small>win rate</small>
      </div>
      <div>
        <small>Rank</small>
        <b>#{stat.rank || '-'}</b>
        <small>Win : Loss</small>
        <span>{stat.wins} : {stat.losses}</span>
      </div>
    </div>
  </div>
);

const formatEloNumber = (value) => Number.isFinite(value) ? value.toFixed(2) : '-';

export const ProfileEloCard = ({ card }) => (
  <article className="profile-elo-card">
    <strong>{card.label}</strong>
    <div className="profile-elo-rank">
      <small>Rank</small>
      <b>#{card.rank || '-'}</b>
    </div>
    <dl>
      <div>
        <dt className="profile-elo-symbol">&mu;</dt>
        <dd>{formatEloNumber(card.mu)}</dd>
      </div>
      <div>
        <dt className="profile-elo-symbol">&sigma;</dt>
        <dd>{formatEloNumber(card.sigma)}</dd>
      </div>
      <div>
        <dt>Games</dt>
        <dd>{card.games}</dd>
      </div>
      <div>
        <dt>Win %</dt>
        <dd>{card.winPct}%</dd>
      </div>
    </dl>
  </article>
);
