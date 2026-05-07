import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Contexts/AppContext";
import LegacySeasonSelector from "./LegacySeasonSelector";

const LegacyEloPage = () => {
    const { queryElo, players } = useContext(AppContext);
    const [seasonStart, setSeasonStart] = useState('2025-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2026-08-31');
    const [singlesElo, setSinglesElo] = useState([]);
    const [doublesElo, setDoublesElo] = useState([]);

    useEffect(() => {
        queryElo('singles', seasonStart, seasonEnd).then(data => {
            setSinglesElo(data);
        });
        queryElo('doubles', seasonStart, seasonEnd).then(data => {
            setDoublesElo(data);
        });
    }, [queryElo, seasonStart, seasonEnd]);

    const doubles = (elo) => {
        const result = [...elo]
            .map(player => ({
                ...player,
                mu: player.doubles_rating.mu,
                sigma: player.doubles_rating.sigma,
            }))
            .sort((a, b) => b.mu - a.mu)
            .filter(player => player.doubles_games_played > 5 && player.sigma < 4);

        return (
            <ListGroup as="ol" numbered>
                {result.map((player, index) => (
                    <ListGroup.Item key={player.name}>
                        <Row>
                            <Col xs={5}>{index + 1}. {player.name}</Col>
                            <Col xs={3}>{player.mu.toFixed(3)}</Col>
                            <Col xs={2}>{player.sigma.toFixed(3)}</Col>
                            <Col xs={2}>{player.doubles_win_pct.toFixed(3)}</Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    };

    const singles = (elo) => {
        const result = [...elo]
            .map(player => ({
                ...player,
                mu: player.singles_rating.mu,
                sigma: player.singles_rating.sigma,
            }))
            .sort((a, b) => b.mu - a.mu)
            .filter(player => player.singles_games_played > 5 && player.sigma < 4);

        return (
            <ListGroup as="ol" numbered>
                {result.map((player, index) => (
                    <ListGroup.Item key={player.name}>
                        <Row>
                            <Col xs={5}>{index + 1}. {player.name}</Col>
                            <Col xs={3}>{player.mu.toFixed(3)}</Col>
                            <Col xs={2}>{player.sigma.toFixed(3)}</Col>
                            <Col xs={2}>{player.singles_win_pct.toFixed(3)}</Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    };

    return (
        <main className="legacy-site">
            <Container>
                <Row className="legacy-page-title">
                    Current Elo Rankings:
                </Row>
                <LegacySeasonSelector
                    setStart={(start) => setSeasonStart(start)}
                    setEnd={(end) => setSeasonEnd(end)}
                />
                {(singlesElo.length === 0 || doublesElo.length === 0 || players.length === 0) ? (
                    <Col className="legacy-page-title">
                        Retreiving data, please be patient...
                    </Col>
                ) : (
                    <Container>
                        <Row>
                            <Col sm={12} md={12}>
                                <div className="legacy-table-header">Singles Elo</div>
                                <ListGroup.Item>
                                    <Row>
                                        <Col xs={5}><b>Name</b></Col>
                                        <Col xs={3}><b>{'\u03BC'}</b></Col>
                                        <Col xs={2}><b>{'\u03C3'}</b></Col>
                                        <Col xs={2}><b>Win %</b></Col>
                                    </Row>
                                </ListGroup.Item>
                                {singles(singlesElo)}
                            </Col>
                            <Col sm={12} md={12}>
                                <div className="legacy-table-header">Doubles Elo</div>
                                <ListGroup.Item>
                                    <Row>
                                        <Col xs={5}><b>Name</b></Col>
                                        <Col xs={3}><b>{'\u03BC'}</b></Col>
                                        <Col xs={2}><b>{'\u03C3'}</b></Col>
                                        <Col xs={2}><b>Win %</b></Col>
                                    </Row>
                                </ListGroup.Item>
                                {doubles(doublesElo)}
                            </Col>
                        </Row>
                    </Container>
                )}
            </Container>
        </main>
    );
};

export default LegacyEloPage;
