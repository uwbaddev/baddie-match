import { Container, Row, Col, Form, Button } from "react-bootstrap";
import '../index.css';
import { useState, useEffect } from "react";
import SinglesForm from "../Forms/SinglesForm";
import DoublesForm from "../Forms/DoublesForm";
import MixedForm from "../Forms/MixedForm";

const ReportMatchComponent = () => {

    const [eventType, setEventType] = useState('');
    const [players, setPlayers] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('https://baddie-match.herokuapp.com/players')
            .then(res => res.json())
            .then(data => {
                setPlayers(data);
            });
        fetch('https://baddie-match.herokuapp.com/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            });
    }, []);

    function selectEvent(event) {
        // console.log(event);
        setEventType(event)
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p className='page-title'>REPORT MATCH</p>
                    </Col>
                </Row>
                <Row>
                    <Col> <p className='page-header'>EVENT</p></Col>
                </Row>
                <Form>
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                            <Form.Check
                                inline
                                label="Singles"
                                name="group1"
                                type={type}
                                id={`inline-${type}-1`}
                                onChange={() => selectEvent('Singles')}
                            />
                            <Form.Check
                                inline
                                label="Doubles"
                                name="group1"
                                type={type}
                                id={`inline-${type}-2`}
                                onChange={() => selectEvent('Doubles')}
                            />
                            <Form.Check
                                inline
                                label="Mixed Doubles"
                                name="group1"
                                type={type}
                                id={`inline-${type}-3`}
                                onChange={() => selectEvent('Mixed')}
                            />
                        </div>
                    ))}
                    {eventType == 'Singles' && <SinglesForm players={players} categories={categories} />}
                    {eventType == 'Doubles' && <DoublesForm players={players} categories={categories} />}
                    {eventType == 'Mixed' && <MixedForm players={players} categories={categories} />}


                </Form>
            </Container>
        </>
    )
}

export default ReportMatchComponent;