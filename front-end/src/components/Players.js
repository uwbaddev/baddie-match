import { useContext, useState } from "react";
import { AppContext } from "../Contexts/AppContext";
import { PageShell, RosterCard } from "./RedesignUI";
import { getRosterBySeason, getRosterCardProfilePath, ROSTER_SEASONS } from "../utils/rosterData";

const Players = () => {
    const { players } = useContext(AppContext);
    const [selectedSeason, setSelectedSeason] = useState(ROSTER_SEASONS[0].value);
    const roster = getRosterBySeason(selectedSeason);

    return (
        <PageShell
            title="Roster"
            className="roster-page"
            actions={(
                <select
                    className="filter-select"
                    aria-label="Roster season"
                    value={selectedSeason}
                    onChange={(event) => setSelectedSeason(event.target.value)}
                >
                    {ROSTER_SEASONS.map(season => (
                        <option key={season.value} value={season.value}>{season.label}</option>
                    ))}
                </select>
            )}
        >
            <RosterSection title="Players">
                {roster.players.map((player, index) => (
                    <RosterCard
                        key={player.slug}
                        player={player}
                        index={index}
                        to={getRosterCardProfilePath(player, players)}
                    />
                ))}
            </RosterSection>
            {roster.coaches.length > 0 && (
                <RosterSection title="Coaches">
                    {roster.coaches.map((person, index) => (
                        <RosterCard
                            key={person.slug}
                            player={person}
                            index={index}
                            subtitle={person.title}
                            to={getRosterCardProfilePath(person, players)}
                        />
                    ))}
                </RosterSection>
            )}
            {roster.supportStaff.length > 0 && (
                <RosterSection title="Support Staff">
                    {roster.supportStaff.map((person, index) => (
                        <RosterCard
                            key={person.slug}
                            player={person}
                            index={index}
                            subtitle={person.title}
                            to={getRosterCardProfilePath(person, players)}
                        />
                    ))}
                </RosterSection>
            )}
        </PageShell>
    )
}

const RosterSection = ({ title, children }) => (
    <section className="roster-section">
        <h2>{title}</h2>
        <div className="roster-grid">
            {children}
        </div>
    </section>
);

export default Players;
