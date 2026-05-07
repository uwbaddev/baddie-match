import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";
import LegacySeasonSelector from "./LegacySeasonSelector";

const LegacyLandingPage = () => {
    const { queryStats } = useContext(AppContext);
    const [stats, setStats] = useState([]);
    const [singlesRankings, setSinglesRankings] = useState([]);
    const [doublesRankings, setDoublesRankings] = useState([]);
    const [mixedRankings, setMixedRankings] = useState([]);
    const [seasonStart, setSeasonStart] = useState('2025-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2026-08-31');

    const updateStats = (category, newStats) => {
        const results = newStats.map(s => {
            let percentage = 0;
            const categoryWins = `${category}_wins`;
            const categoryLosses = `${category}_losses`;
            if (s[categoryWins] + s[categoryLosses] !== 0) {
                percentage = Math.round((s[categoryWins] / (s[categoryWins] + s[categoryLosses])) * 100);
            }
            return {
                name: s.name,
                percentage,
                wins: s[categoryWins],
                losses: s[categoryLosses],
            };
        });
        const items = Object.keys(results).map(key => [key, results[key]]);
        items.sort((first, second) => second[1].percentage - first[1].percentage);
        if (category === 'singles') {
            setSinglesRankings(items);
        } else if (category === 'doubles') {
            setDoublesRankings(items);
        } else {
            setMixedRankings(items);
        }
    };

    useEffect(() => {
        queryStats(seasonStart, seasonEnd).then(data => {
            setStats(data);
        });
    }, [queryStats, seasonStart, seasonEnd]);

    useEffect(() => {
        updateStats('singles', stats);
        updateStats('doubles', stats);
        updateStats('mixed', stats);
    }, [stats]);

    const Rankings = (event) => (
        <ListGroup as="ol" numbered>
            {event.filter(r => r[1].wins + r[1].losses > 4).slice(0, 10).map((r, i) => (
                <ListGroup.Item key={`${r[1].name}-${i}`}>
                    <Row>
                        <Col xs={6}>{i + 1}. {r[1].name}</Col>
                        <Col xs={6}>{r[1].percentage}% (W: {r[1].wins}, L: {r[1].losses})</Col>
                    </Row>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );

    return (
        <main className="legacy-site">
            <Container>
                <Row className="legacy-page-title">
                    Welcome to the official site of the Waterloo Warriors Varsity Badminton Team Statistics!
                </Row>
                <LegacySeasonSelector
                    setStart={(start) => setSeasonStart(start)}
                    setEnd={(end) => setSeasonEnd(end)}
                />
                <Row className="legacy-page-title">
                    Current Rankings By Win %:
                </Row>
                <Container>
                    <Row>
                        <Col sm={12} md={6}>
                            <div className="legacy-table-header">Singles Rankings</div>
                            {Rankings(singlesRankings)}
                        </Col>
                        <Col sm={12} md={6}>
                            <div className="legacy-table-header">Doubles Rankings</div>
                            {Rankings(doublesRankings)}
                        </Col>
                        <Col sm={12} md={6}>
                            <div className="legacy-table-header">Mixed Rankings</div>
                            {Rankings(mixedRankings)}
                        </Col>
                    </Row>
                </Container>
            </Container>
        </main>
    );
};

export default LegacyLandingPage;
