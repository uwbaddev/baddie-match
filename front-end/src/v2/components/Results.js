import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../Contexts/AppContext";
import { MatchCard, MatchFilters, PageShell, PaginationControl, SeasonSelect } from "./RedesignUI";
import {
    SEASON_OPTIONS,
    groupMatchesByDate,
    parseSeasonValue,
    summarizeMatch,
} from "../utils/playerViewModels";

const MATCHES_PER_PAGE = 20;

const ResultsPage = () => {
    const { players, queryMatchPage } = useContext(AppContext)
    const [matches, setMatches] = useState([])
    const [seasonPlayerIds, setSeasonPlayerIds] = useState([]);
    const [eventFilter, setEventFilter] = useState('all');
    const [playerFilter, setPlayerFilter] = useState('all');
    const [seasonValue, setSeasonValue] = useState(SEASON_OPTIONS[0].value);
    const [seasonStart, setSeasonStart] = useState('2026-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2027-08-31');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);

    useEffect(() => {
        let isCurrent = true;

        queryMatchPage(currentPage, MATCHES_PER_PAGE, seasonStart, seasonEnd, eventFilter, playerFilter)
            .then(data => {
                if (!isCurrent) return;
                const metadata = data.metadata || {};
                const nextPageCount = Number(metadata.pageCount || 1);

                setMatches(data.records || []);
                setSeasonPlayerIds(metadata.playerIds || []);
                setPageCount(nextPageCount);
                if (currentPage > nextPageCount) {
                    setCurrentPage(nextPageCount);
                }
            })

        return () => {
            isCurrent = false;
        };
    }, [queryMatchPage, currentPage, seasonStart, seasonEnd, eventFilter, playerFilter])

    const handleSeasonChange = (value, parsedSeason) => {
        const season = parsedSeason || parseSeasonValue(value);
        setSeasonValue(value);
        setSeasonStart(season.start);
        setSeasonEnd(season.end);
        setMatches([]);
        setSeasonPlayerIds([]);
        setPlayerFilter('all');
        setPageCount(1);
        setCurrentPage(1);
    };

    const handleEventFilterChange = (value) => {
        setEventFilter(value);
        setMatches([]);
        setCurrentPage(1);
    };

    const handlePlayerFilterChange = (value) => {
        setPlayerFilter(value);
        setMatches([]);
        setCurrentPage(1);
    };

    const seasonPlayers = useMemo(() => {
        const ids = new Set(seasonPlayerIds.map(Number));
        return players.filter(player => ids.has(Number(player.id)));
    }, [players, seasonPlayerIds]);
    const groupedMatches = groupMatchesByDate(matches);

    return (
        <PageShell title="Results" className="results-page">
            <div className="results-toolbar">
                <MatchFilters players={seasonPlayers} event={eventFilter} playerId={playerFilter} onEventChange={handleEventFilterChange} onPlayerChange={handlePlayerFilterChange}>
                    <label className="match-filter">
                        <span>Season</span>
                        <SeasonSelect value={seasonValue} onChange={handleSeasonChange} />
                    </label>
                </MatchFilters>
            </div>
            <PaginationControl
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                label="Results pages top"
            />

            {players.length === 0 ? (
                <p className="empty-state">Retrieving data, please be patient...</p>
            ) : groupedMatches.length === 0 ? (
                <p className="empty-state">No matches found for this filter.</p>
            ) : (
                <div className="results-list">
                    {groupedMatches.map(group => (
                        <section className="match-day" key={group.key}>
                            <h2>{group.label}</h2>
                            <div className="match-grid">
                                {group.matches.map(match => (
                                    <MatchCard key={match.id} match={summarizeMatch(match, players)} />
                                ))}
                            </div>
                        </section>
                    ))}
                    <PaginationControl
                        currentPage={currentPage}
                        pageCount={pageCount}
                        onPageChange={setCurrentPage}
                        label="Results pages bottom"
                    />
                </div>
            )}
        </PageShell>
    )
}

export default ResultsPage;
