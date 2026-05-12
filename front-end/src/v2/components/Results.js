import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Contexts/AppContext";
import { MatchCard, PageShell, PaginationControl, SeasonSelect } from "./RedesignUI";
import {
    EVENT_FILTERS,
    SEASON_OPTIONS,
    filterMatchesByEvent,
    groupMatchesByDate,
    parseSeasonValue,
    summarizeMatch,
} from "../utils/playerViewModels";

const MATCHES_PER_PAGE = 20;

const ResultsPage = () => {
    const { players, queryMatchPage } = useContext(AppContext)
    const [matches, setMatches] = useState([])
    const [eventFilter, setEventFilter] = useState('all');
    const [seasonValue, setSeasonValue] = useState(SEASON_OPTIONS[0].value);
    const [seasonStart, setSeasonStart] = useState('2025-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2026-08-31');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);

    useEffect(() => {
        let isCurrent = true;

        queryMatchPage(currentPage, MATCHES_PER_PAGE, seasonStart, seasonEnd, eventFilter)
            .then(data => {
                if (!isCurrent) return;
                const metadata = data.metadata || {};
                const nextPageCount = Number(metadata.pageCount || 1);

                setMatches(data.records || []);
                setPageCount(nextPageCount);
                if (currentPage > nextPageCount) {
                    setCurrentPage(nextPageCount);
                }
            })

        return () => {
            isCurrent = false;
        };
    }, [queryMatchPage, currentPage, seasonStart, seasonEnd, eventFilter])

    const handleSeasonChange = (value, parsedSeason) => {
        const season = parsedSeason || parseSeasonValue(value);
        setSeasonValue(value);
        setSeasonStart(season.start);
        setSeasonEnd(season.end);
        setCurrentPage(1);
    };

    const handleEventFilterChange = (event) => {
        setEventFilter(event.target.value);
        setCurrentPage(1);
    };

    const filteredMatches = filterMatchesByEvent(matches, eventFilter);
    const groupedMatches = groupMatchesByDate(filteredMatches);

    return (
        <PageShell title="Results" className="results-page">
            <div className="toolbar-row results-toolbar">
                <SeasonSelect value={seasonValue} onChange={handleSeasonChange} />
                <select
                    className="filter-select"
                    value={eventFilter}
                    onChange={handleEventFilterChange}
                >
                    {EVENT_FILTERS.map(option => (
                        <option key={option.key} value={option.key}>{option.label}</option>
                    ))}
                </select>
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
