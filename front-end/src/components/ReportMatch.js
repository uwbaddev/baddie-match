import { Container, Row, Col, Form, Button } from "react-bootstrap";
import '../index.css';
import { useState, useEffect } from "react";
import SinglesForm from "../Forms/SinglesForm";
import DoublesForm from "../Forms/DoublesForm";
import MixedForm from "../Forms/MixedForm";

const ReportMatchComponent = () => {
    const [eventType, setEventType] = useState('')
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
                                onChange={() => setEventType('Singles')}
                            />
                            <Form.Check
                                inline
                                label="Doubles"
                                name="group1"
                                type={type}
                                id={`inline-${type}-2`}
                                onChange={() => setEventType('Doubles')}
                            />
                            <Form.Check
                                inline
                                label="Mixed Doubles"
                                name="group1"
                                type={type}
                                id={`inline-${type}-3`}
                                onChange={() => setEventType('Mixed')}
                            />
                        </div>
                    ))}
                    {eventType == 'Singles' && <SinglesForm />}
                    {eventType == 'Doubles' && <DoublesForm />}
                    {eventType == 'Mixed' && <MixedForm />}


                </Form>
            </Container>
        </>
    )
}

export default ReportMatchComponent;