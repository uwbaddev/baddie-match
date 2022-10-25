import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";

const LandingPage = () => {
    const { singlesRankings, doublesRankings, mixedRankings} = useContext(AppContext);

    const Rankings = (event) => {
        return <ListGroup as="ol" numbered>
            { event.filter(r => r[1].wins + r[1].losses > 1).slice(0,10).map((r, i) => {
                return <ListGroup.Item>
                            <Row>
                                <Col xs={6}>{i+1}. {r[1].name}</Col>
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
                    Welcome to the official site of the Waterloo Warriors Varsity Badminton Team Statistics!
                </Row>
                <Row className="page-title">
                    Current Rankings By Win %:
                </Row>
                <Container>
                    <Row>
                        <Col sm={12} md={6} >
                            <div className='table-header'>Singles Rankings</div>
                            { Rankings(singlesRankings) }
                        </Col>
                        <Col sm={12} md={6} >
                            <div className='table-header'>Doubles Rankings</div>
                            { Rankings(doublesRankings) }
                        </Col>
                        <Col sm={12} md={6} >
                            <div className='table-header'>Mixed Rankings</div>
                            { Rankings(mixedRankings) }
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    )
}

export default LandingPage