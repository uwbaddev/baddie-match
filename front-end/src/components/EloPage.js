import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextProvider } from "../Contexts/AppContext";
import SeasonSelector from "./SeasonSelector";




const EloPage = () => {
    const { queryElo, players } = useContext(AppContext);
    const [seasonStart, setSeasonStart] = useState('2023-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2024-08-31');
    const [singlesElo, setSinglesElo] = useState([]);
    const [doublesElo, setDoublesElo] = useState([]);



    // useEffect(() => {
    //     queryThenFormatSinglesElo('2023-09-01', '2024-08-31')
    //     queryThenFormatDoublesElo('2023-09-01', '2024-08-31')
    // }, [])

    const queryThenFormatSinglesElo = (newSeasonStart, newSeasonEnd) => {
        queryElo('singles', newSeasonStart, newSeasonEnd).then(data => {
            setSinglesElo(data)
        })
    }

    const queryThenFormatDoublesElo = (newSeasonStart, newSeasonEnd) => {
        queryElo('doubles', newSeasonStart, newSeasonEnd).then(data => {
            setDoublesElo(data)
        })
    }

    useEffect(() => {
        queryThenFormatSinglesElo(seasonStart, seasonEnd);
        queryThenFormatDoublesElo(seasonStart, seasonEnd);
    }, [seasonStart, seasonEnd])



    const doubles = (elo) => {
        elo.map((player) => {
            player['mu'] = player['doubles_rating']['mu']
            player['sigma'] = player['doubles_rating']['sigma']
        })
        elo.sort((a, b) => {
            return b['mu'] - a['mu']
        })

        const result = elo.filter((player) => {
            return player.doubles_games_played > 8 && player.sigma < 3;
        })


        let i = 0
        return <ListGroup as="ol" numbered>
            {
                result.map((player) => {
                    i++
                    return <ListGroup.Item>
                        <Row>
                            <Col xs={5}>{i + '. ' + player['name']}</Col>
                            <Col xs={3}>{player['mu'].toFixed(3)}</Col>
                            <Col xs={2}>{player['sigma'].toFixed(3)}</Col>
                            <Col xs={2}>{player['doubles_win_pct'].toFixed(3)}</Col>

                        </Row>
                    </ListGroup.Item>
                })
            }
        </ListGroup>
    }

    const singles = (elo) => {
        //console.log(elo)
        elo.map((player) => {
            player['mu'] = player['singles_rating']['mu']
            player['sigma'] = player['singles_rating']['sigma']
        })
        elo.sort((a, b) => {
            return b['mu'] - a['mu']
        })

        const result = elo.filter((player) => {
            return player.singles_games_played > 5 && player.sigma < 43;
        })

        let i = 0
        return <ListGroup as="ol" numbered>
            {
                result.map((player) => {
                    i++
                    return <ListGroup.Item>
                        <Row>
                            <Col xs={5}>{i + '. ' + player['name']}</Col>
                            <Col xs={3}>{player['mu'].toFixed(3)}</Col>
                            <Col xs={2}>{player['sigma'].toFixed(3)}</Col>
                            <Col xs={2}>{player['singles_win_pct'].toFixed(3)}</Col>

                        </Row>
                    </ListGroup.Item>
                })
            }
        </ListGroup>
    }

    return (
        <>
            <Container>
                <Row className="page-title">
                    Current Elo Rankings:
                </Row>
                <SeasonSelector
                    setStart={(start) => setSeasonStart(start)}
                    setEnd={(end) => setSeasonEnd(end)}
                />
                {(singlesElo.length == 0 || doublesElo.length == 0 || players.length == 0) ? (
                    <Col className='page-title'>
                        Retreiving data, please be patient...
                    </Col>
                ) : (
                    <Container>
                        <Row>
                            <Col sm={12} md={12} >
                                <div className='table-header'>Singles Elo</div>
                                <ListGroup.Item>
                                    <Row>
                                        <Col xs={5}> <b>Name</b> </Col>
                                        <Col xs={3}> <b>{'\u03BC'}</b> </Col>
                                        <Col xs={2}> <b>{'\u03C3'}</b> </Col>
                                        <Col xs={2}> <b>Win %</b></Col>
                                    </Row>
                                </ListGroup.Item>
                                {singles(singlesElo)}

                            </Col>
                            <Col sm={12} md={12} >
                                <div className='table-header'>Doubles Elo</div>
                                <ListGroup.Item>
                                    <Row>
                                        <Col xs={5}> <b>Name</b> </Col>
                                        <Col xs={3}> <b>{'\u03BC'}</b> </Col>
                                        <Col xs={2}> <b>{'\u03C3'}</b> </Col>
                                        <Col xs={2}> <b>Win %</b></Col>
                                    </Row>
                                </ListGroup.Item>
                                {doubles(doublesElo)}
                            </Col>
                        </Row>
                    </Container>
                )}
            </Container>
        </>
    )
}

export default EloPage;