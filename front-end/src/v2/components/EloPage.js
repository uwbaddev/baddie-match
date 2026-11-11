import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Contexts/AppContext";
import {
    EloGroupSection,
    PageShell,
    PlacementProgress,
    PodiumBadge,
    PromotionTag,
    RankingsTable,
    SeasonSelect,
    TabControl,
} from "./RedesignUI";
import {
    buildEloGroups,
    cleanSeedPrefix,
    ELO_SCORE_SIGMAS,
    SEASON_OPTIONS,
    findPlayerByName,
    getPlayerProfilePath,
    parseSeasonValue,
} from "../utils/playerViewModels";

const ELO_EVENT_TABS = [
    { key: 'singles', label: 'Singles' },
    { key: 'doubles', label: 'Doubles' },
];

const GROUP_TONES = 4;

const linkPlayer = (players) => (row) => {
    const localPlayer = findPlayerByName(players, row.name);
    return {
        ...row,
        id: row.id || (localPlayer && localPlayer.id),
        name: cleanSeedPrefix(row.name),
        to: row.to || getPlayerProfilePath(localPlayer),
    };
};

const renderName = row => (
    <span className="elo-name-cell">
        {row.to
            ? <Link className="table-name-link" to={row.to}>{row.name}</Link>
            : row.name}
        {row.podium && <PodiumBadge place={row.podium} />}
        {row.promotion && <PromotionTag />}
    </span>
);

const GROUP_COLUMNS = [
    { key: 'name', label: 'Name', render: renderName },
    { key: 'games', label: 'Games' },
];

const PLACING_COLUMNS = [
    { key: 'name', label: 'Name', render: renderName },
    { key: 'games', label: 'Games', render: row => <PlacementProgress games={row.games} needed={row.placementGames} /> },
];

const formatRating = value => (Number.isFinite(value) ? value.toFixed(2) : '-');

const DETAIL_COLUMNS = [
    { key: 'name', label: 'Name', render: row => row.name },
    { key: 'group', label: 'Group', render: row => row.groupLabel || 'Getting placed' },
    { key: 'score', label: `Score (μ − ${ELO_SCORE_SIGMAS}σ)`, render: row => formatRating(row.score) },
    { key: 'mu', label: 'μ', render: row => formatRating(row.mu) },
    { key: 'sigma', label: 'σ', render: row => formatRating(row.sigma) },
    { key: 'games', label: 'Games' },
];

const EloDetails = ({ rows }) => (
    <details className="elo-details">
        <summary>Show details</summary>
        <p className="elo-details-note">
            Sorted by score = &mu; &minus; {ELO_SCORE_SIGMAS}&sigma;, the cautious rating used for grouping.
        </p>
        <RankingsTable columns={DETAIL_COLUMNS} rows={rows} />
    </details>
);

const EloPage = () => {
    const { players, queryElo } = useContext(AppContext);
    const [seasonValue, setSeasonValue] = useState(SEASON_OPTIONS[0].value);
    const [seasonStart, setSeasonStart] = useState('2026-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2027-08-31');
    const [activeEvent, setActiveEvent] = useState('singles');
    const [singlesElo, setSinglesElo] = useState(null);
    const [doublesElo, setDoublesElo] = useState(null);

    useEffect(() => {
        setSinglesElo(null);
        setDoublesElo(null);
        queryElo('singles', seasonStart, seasonEnd).then(data => setSinglesElo(data || []));
        queryElo('doubles', seasonStart, seasonEnd).then(data => setDoublesElo(data || []));
    }, [seasonStart, seasonEnd, queryElo])

    const handleSeasonChange = (value, parsedSeason) => {
        const season = parsedSeason || parseSeasonValue(value);
        setSeasonValue(value);
        setSeasonStart(season.start);
        setSeasonEnd(season.end);
    };

    const eventElo = activeEvent === 'singles' ? singlesElo : doublesElo;

    // Shuffle once per data load so the order inside a group doesn't change on every render.
    const eloGroups = useMemo(
        () => (eventElo ? buildEloGroups(eventElo, activeEvent) : null),
        [eventElo, activeEvent]
    );

    const withLinks = linkPlayer(players);
    const groups = eloGroups
        ? eloGroups.groups.map(group => ({ ...group, players: group.players.map(withLinks) }))
        : [];
    const placing = eloGroups ? eloGroups.placing.map(withLinks) : [];

    const renderBody = () => {
        if (!eloGroups) {
            return <p className="empty-state">Retrieving data, please be patient...</p>;
        }
        if (groups.length === 0 && placing.length === 0) {
            return <p className="empty-state">No matches yet this season.</p>;
        }
        return (
            <div className="elo-groups">
                {groups.map((group, index) => (
                    <EloGroupSection key={group.key} label={group.label} tone={(index % GROUP_TONES) + 1}>
                        <RankingsTable columns={GROUP_COLUMNS} rows={group.players} />
                    </EloGroupSection>
                ))}
                {placing.length > 0 && (
                    <EloGroupSection label="Getting placed" tone="placing">
                        <RankingsTable columns={PLACING_COLUMNS} rows={placing} />
                    </EloGroupSection>
                )}
                <EloDetails
                    rows={[...groups.flatMap(group => group.players), ...placing]
                        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))}
                />
            </div>
        );
    };

    return (
        <PageShell title="Rankings" eyebrow="Current elo groups">
            <div className="toolbar-row">
                <TabControl tabs={ELO_EVENT_TABS} active={activeEvent} onChange={setActiveEvent} />
                <SeasonSelect value={seasonValue} onChange={handleSeasonChange} />
            </div>
            {renderBody()}
        </PageShell>
    )
}

export default EloPage;
