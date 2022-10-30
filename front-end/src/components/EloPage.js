import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";


const EloPage = () => {
    const { singlesElo, doublesElo } = useContext(AppContext);

    const doubles = (elo) => {
        elo.map((player) => {
            player['mu'] = player['doubles_rating']['mu']
            player['sigma'] = player['doubles_rating']['sigma']
        })
        elo.sort((a, b) => {
            return b['mu'] - a['mu']
        })
        elo.map((player) => {
            console.log(player['name'])
        })
        
        let i = 0
        return <ListGroup as="ol" numbered>
            {
                elo.map((player) => {
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
        console.log(elo)
        elo.map((player) => {
            player['mu'] = player['singles_rating']['mu']
            player['sigma'] = player['singles_rating']['sigma']
        })
        elo.sort((a, b) => {
            return b['single_elo'] - a['singles_elo']
        })
        elo.map((player) => {
            console.log(player['name'])
        })
        
        let i = 0
        return <ListGroup as="ol" numbered>
            {
                elo.map((player) => {
                    i++
                    return <ListGroup.Item>
                        <Row>
                            <Col xs={4}>{i + '. ' + player['name']}</Col>
                            <Col xs={2}>{player['singles_elo'].toFixed(0)}</Col>
                            <Col xs={2}>{player['mu'].toFixed(3)}</Col>
                            <Col xs={2}>{player['sigma'].toFixed(3)}</Col>
                            <Col xs={2}>{player['singles_win_pct'].toFixed(3)}</Col>

                        </Row>
                    </ListGroup.Item>
                })
            }
        </ListGroup>
    }

    const Rankings = (event) => {
        return <ListGroup as="ol" numbered>
            {event.filter(r => r[1].wins + r[1].losses > 1).slice(0, 10).map((r, i) => {
                return <ListGroup.Item>
                    <Row>
                        <Col xs={6}>{i + 1}. {r[1].name}</Col>
                        <Col xs={6}>{r[1].percentage}% (W: {r[1].wins}, L: {r[1].losses})</Col>
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
                {(singlesElo.length == 0 || doublesElo.length == 0) ? (
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
                                        <Col xs={4}> <b>Name</b> </Col>
                                        <Col xs={2}> <b>Elo</b> </Col>
                                        <Col xs={2}> <b>{'\u03BC'}</b> </Col>
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