import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import SeasonSelector from "./SeasonSelector";
import { EloV2SinglesUrl } from "../API/API";

const EloPageV2 = () => {
    const [seasonStart, setSeasonStart] = useState('2025-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2026-08-31');
    const [singlesElo, setSinglesElo] = useState([]);

    const fetchSingles = (start, end) => {
        fetch(EloV2SinglesUrl(start, end), { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => setSinglesElo(data));
    };

    useEffect(() => {
        fetchSingles(seasonStart, seasonEnd);
    }, [seasonStart, seasonEnd]);

    const renderSingles = (elo) => {
        const enriched = elo
            .map(p => {
                const mu = (p.mu !== undefined) ? p.mu : (p.singles_rating && p.singles_rating.mu);
                const sigma = (p.sigma !== undefined) ? p.sigma : (p.singles_rating && p.singles_rating.sigma);
                return {
                    ...p,
                    name: `${p.first_name} ${p.last_name}`,
                    mu: mu || 0,
                    sigma: sigma || 0,
                    singles_games_played: p.singles_games_played || (p.singles_wins || 0) + (p.singles_losses || 0) + (p.singles_draws || 0),
                    singles_win_pct: p.singles_win_pct || 0,
                }
            })
            .filter(p => (p.sigma || 0) < 1000);

        enriched.sort((a, b) => (b.mu) - (a.mu));

        let i = 0;
        return <ListGroup as="ol" numbered>
            {enriched.map(player => {
                i++;
                return <ListGroup.Item key={`${player.id}-${i}`}>
                    <Row>
                        <Col xs={5}>{i + '. ' + player.name}</Col>
                        <Col xs={3}>{(player.mu).toFixed(3)}</Col>
                        <Col xs={2}>{(player.sigma).toFixed(3)}</Col>
                        <Col xs={2}>{(player.singles_win_pct).toFixed(3)}</Col>
                    </Row>
                </ListGroup.Item>
            })}
        </ListGroup>
    };

    return (
        <>
            <Container>
                <Row className="page-title">
                    Current Elo Rankings (v2 Singles):
                </Row>
                <SeasonSelector
                    setStart={(start) => setSeasonStart(start)}
                    setEnd={(end) => setSeasonEnd(end)}
                />
                {(singlesElo.length === 0) ? (
                    <Col className='page-title'>
                        Retreiving data, please be patient...
                    </Col>
                ) : (
                    <Container>
                        <Row>
                            <Col sm={12} md={12} >
                                <div className='table-header'>Singles Elo (v2)</div>
                                <ListGroup.Item>
                                    <Row>
                                        <Col xs={5}> <b>Name</b> </Col>
                                        <Col xs={3}> <b>{'\u03BC'}</b> </Col>
                                        <Col xs={2}> <b>{'\u03C3'}</b> </Col>
                                        <Col xs={2}> <b>Win %</b></Col>
                                    </Row>
                                </ListGroup.Item>
                                {renderSingles(singlesElo)}
                            </Col>
                        </Row>
                    </Container>
                )}
            </Container>
        </>
    );
};

export default EloPageV2;


