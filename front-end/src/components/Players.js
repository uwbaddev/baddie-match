import { Container, Tabs, Tab, Row, Col, Image } from "react-bootstrap";
import { useContext } from "react";
import '../index.css';
import { useRef } from "react";
import { AppContext } from "../Contexts/AppContext";

const Players = () => {
    const { players } = useContext(AppContext);

    return (
        <>
            <Container>
                <Row>
                    <Col> <p className='page-title'>All Players</p></Col>
                </Row>
                {players.length == 0 ? (
                    /* if no matches yet or if there are matches but no players */
                    <Col className='page-title'>
                        Retreiving data, please be patient...
                    </Col>
                ) : (
                    <>
                        <Container fluid className='PlayersList'>
                            {players.map((p, index) => {
                                return (
                                    <div>
                                        <Row className={index % 2 === 0 ? 'even-row' : 'odd-row'} style={{ height: '150px' }}>
                                            <Col xs={1}>
                                                <Image className="playerImage" src="https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081" rounded />
                                            </Col>
                                            <Col xs={5}>
                                                <div style={{ fontSize: '12px' }}>
                                                    Event/ years on the team
                                                </div>
                                                <div style={{ fontWeight: '600' }}>
                                                    &nbsp; {p.first_name} {p.last_name}
                                                </div>
                                            </Col>
                                            <Col xs={5}>
                                                Program / Home City / School?
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            })
                            }
                        </Container>
                    </>
                )}
            </Container>
        </>
    )
}

export default Players;