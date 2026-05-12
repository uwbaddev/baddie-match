import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom";
import { AppContext } from "../../Contexts/AppContext";
import { PageShell, PaginationControl, RankingsTable, SeasonSelect, TabControl } from "./RedesignUI";
import { buildWinRankings, EVENT_TABS, SEASON_OPTIONS, parseSeasonValue } from "../utils/playerViewModels";

const RANKINGS_PER_PAGE = 10;

const LandingPage = () => {
    const { queryStats } = useContext(AppContext);
    const [stats, setStats] = useState([]);
    const [activeEvent, setActiveEvent] = useState('singles');
    const [currentPage, setCurrentPage] = useState(1);
    const [seasonValue, setSeasonValue] = useState(SEASON_OPTIONS[0].value);
    const [seasonStart, setSeasonStart] = useState('2025-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2026-08-31');

    const getStats = (newSeasonStart, newSeasonEnd) => {
        queryStats(newSeasonStart, newSeasonEnd).then(data => {
            setStats(data)
        })
    }

    useEffect(() => {
        getStats(seasonStart, seasonEnd);
    }, [seasonStart, seasonEnd])

    const handleSeasonChange = (value, parsedSeason) => {
        const season = parsedSeason || parseSeasonValue(value);
        setSeasonValue(value);
        setSeasonStart(season.start);
        setSeasonEnd(season.end);
        setCurrentPage(1);
    }

    const handleEventChange = (eventKey) => {
        setActiveEvent(eventKey);
        setCurrentPage(1);
    };

    const rankings = buildWinRankings(stats, activeEvent);
    const pageCount = Math.ceil(rankings.length / RANKINGS_PER_PAGE);
    const pageStart = (currentPage - 1) * RANKINGS_PER_PAGE;
    const visibleRankings = rankings.slice(pageStart, pageStart + RANKINGS_PER_PAGE);
    const columns = [
        { key: 'rank', label: 'Rank' },
        {
            key: 'name',
            label: 'Name',
            render: row => row.to
                ? <Link className="table-name-link" to={row.to}>{row.name}</Link>
                : row.name
        },
        { key: 'winPct', label: 'Win %', render: row => `${row.winPct}%` },
        { key: 'record', label: 'W : L' },
    ];

    return (
        <PageShell title="Team Statistics" eyebrow="Current rankings by win %">
            <div className="toolbar-row">
                <TabControl tabs={EVENT_TABS} active={activeEvent} onChange={handleEventChange} />
                <SeasonSelect value={seasonValue} onChange={handleSeasonChange} />
            </div>
            <RankingsTable columns={columns} rows={visibleRankings} />
            <PaginationControl
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                label="Win rate ranking pages"
            />
        </PageShell>
    )
}

export default LandingPage
