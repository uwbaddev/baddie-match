import { useContext, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, LoaderCircle, RotateCcw, X } from 'lucide-react';
import { AppContext } from '../../Contexts/AppContext';
import { ReportMatchUrl } from '../../API/API';
import { cleanSeedPrefix, formatPlayerName } from '../utils/playerViewModels';

const matchCategories = [
    { value: 'ranked', label: 'Ranked' },
    { value: 'practice', label: 'Practice' },
];

const ReportMatchForm = ({ event, submitting, onSubmittingChange }) => {
    const { activePlayers, categories } = useContext(AppContext);
    const singles = event === 'Singles';
    const playersPerSide = singles ? 1 : 2;
    const [players, setPlayers] = useState(Array(playersPerSide * 2).fill(''));
    const [scores, setScores] = useState(Array(6).fill(''));
    const [category, setCategory] = useState('ranked');
    const [notice, setNotice] = useState(null);
    const [cooldown, setCooldown] = useState(false);

    useEffect(() => {
        if (!cooldown || submitting) return;
        const timer = setTimeout(() => setCooldown(false), 3000);
        return () => clearTimeout(timer);
    }, [cooldown, submitting]);

    const sideLabel = (side) => `${singles ? 'Player' : 'Team'} ${side === 0 ? 'one' : 'two'}`;
    const selectedPlayers = (side) => players
        .slice(side * playersPerSide, (side + 1) * playersPerSide)
        .map(id => activePlayers.find(player => String(player.id) === id))
        .filter(Boolean);

    const reset = () => {
        setPlayers(Array(playersPerSide * 2).fill(''));
        setScores(Array(6).fill(''));
        setCategory('ranked');
        setNotice(null);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (submitting || cooldown) return;
        const fail = (text) => setNotice({ type: 'error', text });
        if (players.some(id => !id)) return fail('Select a player for every position.');
        if (new Set(players).size !== players.length) return fail('Each player can only appear once.');
        if (scores[0] === '' || scores[1] === '') return fail('Enter both scores for Game 1.');
        for (let game = 0; game < 3; game += 1) {
            const pair = scores.slice(game * 2, game * 2 + 2);
            if (pair.some(value => value !== '') && pair.some(value => value === '')) {
                return fail(`Enter both scores for Game ${game + 1}.`);
            }
        }
        const numericScores = scores.map(value => value === '' ? 0 : Number(value));
        if (numericScores.some(value => !Number.isInteger(value) || value < 0 || value > 30)) {
            return fail('Scores must be whole numbers from 0 to 30.');
        }
        if (numericScores.every(value => value === 0)) return fail('Enter a score for at least one game.');
        const selectedCategory = categories.find(item => cleanSeedPrefix(item.name).toLowerCase() === category);
        if (!selectedCategory) return fail('Match categories are still loading. Please try again.');

        const payload = { event, score: numericScores, category: selectedCategory.name };
        players.forEach((id, index) => { payload[`player${index + 1}Id`] = Number(id); });
        onSubmittingChange(true);
        setCooldown(true);
        setNotice(null);
        try {
            const response = await fetch(ReportMatchUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const text = await response.text();
            if (!response.ok) throw new Error(text || 'Could not submit the match.');
            reset();
            setNotice({ type: 'success', text: 'Match submitted.' });
        } catch (error) {
            setNotice({ type: 'error', text: error.message || 'Could not submit the match. Try again.' });
        } finally {
            onSubmittingChange(false);
        }
    };

    return (
        <form id="match-form" onSubmit={submit} noValidate>
            {notice && (
                <div className={`report-notice is-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
                    {notice.type === 'error' ? <CircleAlert size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
                    <span>{notice.text}</span>
                    <button type="button" aria-label="Dismiss message" title="Dismiss message" onClick={() => setNotice(null)}><X size={16} /></button>
                </div>
            )}
            <section className="report-section" aria-label="Players">
                <div className="report-sides">
                    {[0, 1].map(side => (
                        <div className="report-side" key={side}>
                            <div className="report-side-heading" id={`report-side-${side}`}>
                                <h3>{sideLabel(side)}</h3>
                            </div>
                            {Array.from({ length: playersPerSide }, (_, slot) => {
                                const index = side * playersPerSide + slot;
                                const sex = event === 'Mixed' ? (slot === 0 ? 'M' : 'F') : null;
                                const label = sex ? (sex === 'M' ? 'Male' : 'Female') : `Player ${slot + 1}`;
                                return (
                                    <div className="report-player-field" key={index}>
                                        {!singles && <label htmlFor={`report-player-${index}`}>{label}</label>}
                                        <select
                                            id={`report-player-${index}`}
                                            aria-label={singles ? sideLabel(side) : `${sideLabel(side)}, ${label}`}
                                            value={players[index]}
                                            disabled={submitting}
                                            onChange={e => setPlayers(players.map((value, i) => i === index ? e.target.value : value))}
                                        >
                                            <option value="">Choose a player</option>
                                            {activePlayers.filter(player => !sex || player.sex === sex).map(player => (
                                                <option key={player.id} value={player.id} disabled={players.some((id, i) => i !== index && id === String(player.id))}>
                                                    {formatPlayerName(player)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}
                            {side === 0 && <span className="report-versus" aria-hidden="true">vs</span>}
                        </div>
                    ))}
                </div>
            </section>

            <section className="report-section report-scores" aria-label="Scores">
                <div className="report-score-grid report-score-head">
                    <h2>Score</h2>
                    {[1, 2, 3].map(game => <span key={game} aria-hidden="true">Game {game}</span>)}
                </div>
                {[0, 1].map(side => {
                    const selected = selectedPlayers(side);
                    return (
                        <div className="report-score-grid report-score-row" key={side}>
                            <div className="report-score-player">
                                <span>{selected.length ? selected.map(player => formatPlayerName(player)).join(' / ') : sideLabel(side)}</span>
                            </div>
                            {[0, 1, 2].map(game => {
                                const index = game * 2 + side;
                                return (
                                    <input
                                        key={game}
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        max="30"
                                        step="1"
                                        aria-label={`${sideLabel(side)}, Game ${game + 1} score`}
                                        placeholder="0"
                                        value={scores[index]}
                                        disabled={submitting}
                                        onChange={e => setScores(scores.map((value, i) => i === index ? e.target.value : value))}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </section>

            <div className="report-footer">
                <div className="report-category">
                    <span className="report-category-label" id="report-category-label">Category</span>
                    <div className="report-category-toggle" role="radiogroup" aria-labelledby="report-category-label">
                        {matchCategories.map(item => (
                            <label key={item.value}>
                                <input type="radio" name="match-category" value={item.value} checked={category === item.value} disabled={submitting} onChange={() => setCategory(item.value)} />
                                <span>{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="report-actions">
                    <button className="report-reset" type="button" onClick={reset} disabled={submitting || cooldown} aria-label="Clear form" title="Clear form"><RotateCcw size={18} /></button>
                    <button className="report-submit" type="submit" disabled={submitting || cooldown}>
                        {submitting ? 'Submitting' : 'Submit match'}
                        {submitting ? <LoaderCircle size={17} className="report-spinner" aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ReportMatchForm;
