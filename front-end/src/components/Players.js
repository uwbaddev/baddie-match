import { Container, Tabs, Tab, Row, Col, Form } from "react-bootstrap";
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
                { players.length == 0 ? (
                    /* if no matches yet or if there are matches but no players */
                    <Col className='page-title'>
                        Retreiving data, please be patient...
                    </Col>
                ) : (
                    <>
                        {players.map(p => {
                            return (
                                <Row>
                                    {p.first_name} {p.last_name}
                                </Row>
                            )
                        })
                    }
                    </>
                )}
            </Container>
        </>
    )
}

export default Players;