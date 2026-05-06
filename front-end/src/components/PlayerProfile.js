import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../Contexts/AppContext";
import { MatchCard, PaginationControl, PlayerAvatar, ProfileEloCard, StatRing } from "./RedesignUI";
import {
    buildEloRankings,
    findPlayer,
    formatPlayerName,
    groupMatchesByDate,
    makeProfileEloCards,
    makeProfileStats,
    summarizeMatch,
} from "../utils/playerViewModels";
import {
    ALL_TIME_STATS_SEASON,
    findLatestRosterRecord,
    findLatestRosterRecordForLocalPlayer,
    findLocalPlayerForRoster,
    findRosterRecordForLocalPlayer,
    findRosterPlayer,
    getStatsSeasonRange,
    hasPlayerStats,
    ROSTER_STATS_SEASONS,
} from "../utils/rosterData";

const PROFILE_MATCHES_PER_PAGE = 6;

const PlayerProfile = () => {
    const { id, season, slug } = useParams();
    const { players, queryPlayerResults, queryStats, queryElo } = useContext(AppContext);
    const [matches, setMatches] = useState([]);
    const [stats, setStats] = useState([]);
    const [singlesElo, setSinglesElo] = useState([]);
    const [doublesElo, setDoublesElo] = useState([]);
    const [statsSeasonOptions, setStatsSeasonOptions] = useState([]);
    const [selectedStatsSeason, setSelectedStatsSeason] = useState('');
    const [matchPage, setMatchPage] = useState(1);

    const routeLocalPlayer = id ? findPlayer(players, id) : null;
    const slugRosterPlayer = season && slug ? findRosterPlayer(season, slug) : null;
    const idRosterPlayer = season && id ? findRosterRecordForLocalPlayer(season, routeLocalPlayer) : null;
    const rosterPlayer = idRosterPlayer || slugRosterPlayer;
    const localPlayer = routeLocalPlayer || (slugRosterPlayer ? findLocalPlayerForRoster(slugRosterPlayer, players) : null);
    const localRosterPlayer = !season && !rosterPlayer ? findLatestRosterRecordForLocalPlayer(localPlayer) : null;
    const displayRosterPlayer = rosterPlayer || localRosterPlayer;
    const statsPlayerId = localPlayer && localPlayer.id;
    const latestRosterRecord = displayRosterPlayer ? findLatestRosterRecord(displayRosterPlayer) : null;
    const profilePlayer = displayRosterPlayer && latestRosterRecord
        ? { ...displayRosterPlayer, photoUrl: latestRosterRecord.photoUrl || displayRosterPlayer.photoUrl }
        : localPlayer;
    const playerName = displayRosterPlayer ? displayRosterPlayer.name : formatPlayerName(localPlayer);
    const roleTitle = displayRosterPlayer && displayRosterPlayer.title ? displayRosterPlayer.title : '';

    useEffect(() => {
        setStatsSeasonOptions([]);
        setSelectedStatsSeason('');
        setStats([]);
        setMatches([]);
        setSinglesElo([]);
        setDoublesElo([]);
        setMatchPage(1);

        if (!statsPlayerId) return;

        Promise.all(
            ROSTER_STATS_SEASONS.map(option => (
                queryStats(option.start, option.end).then(data => {
                    const records = data || [];
                    const playerStats = records.find(record => Number(record.id) === Number(statsPlayerId));
                    return {
                        ...option,
                        hasStats: hasPlayerStats(playerStats),
                    };
                })
            ))
        ).then(options => {
            const availableOptions = options.filter(option => option.hasStats);
            const defaultOption = availableOptions.find(option => option.value === season) || ALL_TIME_STATS_SEASON;
            setStatsSeasonOptions([...availableOptions, ALL_TIME_STATS_SEASON]);
            setSelectedStatsSeason(defaultOption.value);
        });
    }, [statsPlayerId, season, queryStats]);

    useEffect(() => {
        if (!statsPlayerId || !selectedStatsSeason) return;

        setMatchPage(1);
        const statsSeason = getStatsSeasonRange(selectedStatsSeason);
        Promise.all([
            queryPlayerResults(statsPlayerId, statsSeason.start, statsSeason.end),
            queryElo('singles', statsSeason.start, statsSeason.end),
            queryElo('doubles', statsSeason.start, statsSeason.end),
            queryStats(statsSeason.start, statsSeason.end),
        ]).then(([matchData, singlesEloData, doublesEloData, statsData]) => {
            setMatches(matchData || []);
            setSinglesElo(singlesEloData || []);
            setDoublesElo(doublesEloData || []);
            setStats(statsData || []);
        });
    }, [statsPlayerId, selectedStatsSeason, queryPlayerResults, queryStats, queryElo]);

    const statsRecord = useMemo(
        () => stats.find(record => Number(record.id) === Number(statsPlayerId)),
        [stats, statsPlayerId]
    );

    const singlesEloRankings = useMemo(() => buildEloRankings(singlesElo, 'singles'), [singlesElo]);
    const doublesEloRankings = useMemo(() => buildEloRankings(doublesElo, 'doubles'), [doublesElo]);
    const profileStats = useMemo(() => makeProfileStats(statsRecord, stats), [statsRecord, stats]);
    const profileEloCards = useMemo(
        () => makeProfileEloCards(statsRecord, singlesEloRankings, doublesEloRankings),
        [statsRecord, singlesEloRankings, doublesEloRankings]
    );
    const matchPageCount = Math.max(1, Math.ceil(matches.length / PROFILE_MATCHES_PER_PAGE));
    const paginatedMatches = useMemo(() => {
        const startIndex = (matchPage - 1) * PROFILE_MATCHES_PER_PAGE;
        return matches.slice(startIndex, startIndex + PROFILE_MATCHES_PER_PAGE);
    }, [matches, matchPage]);
    const matchGroups = useMemo(() => groupMatchesByDate(paginatedMatches), [paginatedMatches]);

    const details = [
        displayRosterPlayer && displayRosterPlayer.program ? ['Program', displayRosterPlayer.program] : null,
        displayRosterPlayer && displayRosterPlayer.hometown ? ['Hometown', displayRosterPlayer.hometown] : null,
        displayRosterPlayer && displayRosterPlayer.highSchool ? ['High School', displayRosterPlayer.highSchool] : null,
        displayRosterPlayer && displayRosterPlayer.height ? ['Height', displayRosterPlayer.height] : null,
    ].filter(Boolean);

    return (
        <main className="page-shell profile-page">
            <Link className="back-link" to="/players">
                <ArrowLeft size={18} />
                Back to Roster
            </Link>

            <section className="profile-hero">
                <div className="profile-hero-media">
                    <PlayerAvatar player={profilePlayer} size="lg" />
                </div>
                <div className="profile-hero-content is-left-aligned">
                    <h1 className="profile-hero-title">{playerName}</h1>
                    {roleTitle && <p className="profile-role">{roleTitle}</p>}
                    {details.length > 0 && (
                        <dl className="profile-details">
                            {details.map(([label, value]) => (
                                <div key={label}>
                                    <dt>{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </section>

            {statsPlayerId ? (
                <>
                    <div className="profile-stats-toolbar">
                        <label htmlFor="profile-stats-season">Stats</label>
                        <select
                            id="profile-stats-season"
                            className="filter-select"
                            aria-label="Stats season"
                            value={selectedStatsSeason}
                            onChange={(event) => setSelectedStatsSeason(event.target.value)}
                        >
                            {statsSeasonOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {profileStats.length > 0 ? (
                        <>
                            <section className="profile-metric-section">
                                <h2>Win Rate</h2>
                                <div className="profile-stats-grid">
                                    {profileStats.map(stat => <StatRing key={stat.label} stat={stat} />)}
                                </div>
                            </section>
                            <section className="profile-metric-section profile-elo-section">
                                <h2>Elo Rankings</h2>
                                {profileEloCards.length > 0 ? (
                                    <div className="profile-elo-grid">
                                        {profileEloCards.map(card => <ProfileEloCard key={card.label} card={card} />)}
                                    </div>
                                ) : (
                                    <p className="empty-state">No Elo rankings found for this stats range.</p>
                                )}
                            </section>
                        </>
                    ) : (
                        <p className="empty-state">No stats found for this stats range.</p>
                    )}
                </>
            ) : (
                <p className="empty-state">No stats found for this player.</p>
            )}

            <section className="profile-recent">
                <h2>Matches with {playerName}</h2>
                <PaginationControl
                    currentPage={matchPage}
                    pageCount={matchPageCount}
                    onPageChange={setMatchPage}
                    label="Profile match pages"
                />
                <div className="results-list">
                    {matchGroups.map(group => (
                        <section className="match-day" key={group.key}>
                            <h2>{group.label}</h2>
                            <div className="match-grid">
                                {group.matches.map(match => (
                                    <MatchCard key={match.id} match={summarizeMatch(match, players)} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
                {matches.length === 0 && <p className="empty-state">No matches found for this stats range.</p>}
            </section>
        </main>
    )
}

export default PlayerProfile;
