import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom";
import { AppContext } from "../Contexts/AppContext";
import { PageShell, RankingsTable, SeasonSelect, TabControl } from "./RedesignUI";
import { buildWinRankings, EVENT_TABS, SEASON_OPTIONS, parseSeasonValue } from "../utils/playerViewModels";

const LandingPage = () => {
    const { queryStats } = useContext(AppContext);
    const [stats, setStats] = useState([]);
    const [activeEvent, setActiveEvent] = useState('singles');
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
    }

    const rankings = buildWinRankings(stats, activeEvent).slice(0, 10);
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
                <TabControl tabs={EVENT_TABS} active={activeEvent} onChange={setActiveEvent} />
                <SeasonSelect value={seasonValue} onChange={handleSeasonChange} />
            </div>
            <RankingsTable columns={columns} rows={rankings} />
        </PageShell>
    )
}

export default LandingPage
