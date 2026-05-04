import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../Contexts/AppContext";
import { PageShell, RankingsTable, SeasonSelect, TabControl } from "./RedesignUI";
import {
    buildEloRankings,
    buildWinRankings,
    cleanSeedPrefix,
    EVENT_TABS,
    SEASON_OPTIONS,
    findPlayerByName,
    getPlayerProfilePath,
    parseSeasonValue,
} from "../utils/playerViewModels";

const EloPage = () => {
    const { players, queryElo, queryStats } = useContext(AppContext);
    const [seasonValue, setSeasonValue] = useState(SEASON_OPTIONS[0].value);
    const [seasonStart, setSeasonStart] = useState('2025-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2026-08-31');
    const [activeEvent, setActiveEvent] = useState('singles');
    const [singlesElo, setSinglesElo] = useState([]);
    const [doublesElo, setDoublesElo] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        queryElo('singles', seasonStart, seasonEnd).then(data => setSinglesElo(data || []));
        queryElo('doubles', seasonStart, seasonEnd).then(data => setDoublesElo(data || []));
        queryStats(seasonStart, seasonEnd).then(data => setStats(data || []));
    }, [seasonStart, seasonEnd])

    const handleSeasonChange = (value, parsedSeason) => {
        const season = parsedSeason || parseSeasonValue(value);
        setSeasonValue(value);
        setSeasonStart(season.start);
        setSeasonEnd(season.end);
    };

    const rankings = activeEvent === 'mixed'
        ? buildWinRankings(stats, 'mixed').map(row => ({
            ...row,
            mu: '-',
            sigma: '-',
        }))
        : buildEloRankings(activeEvent === 'singles' ? singlesElo : doublesElo, activeEvent)
            .map(row => {
                const localPlayer = findPlayerByName(players, row.name);
                return {
                    ...row,
                    id: row.id || (localPlayer && localPlayer.id),
                    name: cleanSeedPrefix(row.name),
                    to: row.to || getPlayerProfilePath(localPlayer),
                };
            });

    const columns = [
        { key: 'rank', label: 'Rank' },
        {
            key: 'name',
            label: 'Name',
            render: row => row.to
                ? <Link className="table-name-link" to={row.to}>{row.name}</Link>
                : row.name,
        },
        { key: 'mu', label: '\u03bc', render: row => Number.isFinite(row.mu) ? row.mu.toFixed(2) : row.mu },
        { key: 'sigma', label: '\u03c3', render: row => Number.isFinite(row.sigma) ? row.sigma.toFixed(2) : row.sigma },
        { key: 'winPct', label: 'Win %', render: row => `${row.winPct}%` },
    ];

    return (
        <PageShell title="Rankings" eyebrow="Current elo rankings">
            <div className="toolbar-row">
                <TabControl tabs={EVENT_TABS} active={activeEvent} onChange={setActiveEvent} />
                <SeasonSelect value={seasonValue} onChange={handleSeasonChange} />
            </div>
            <RankingsTable columns={columns} rows={rankings.slice(0, 10)} />
        </PageShell>
    )
}

export default EloPage;
