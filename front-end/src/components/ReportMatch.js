import { Container, Row, Col, Form, Button } from "react-bootstrap";
import EventSelect from "../Helpers/FormButton";
import '../index.css';
import { useState } from "react";
import SinglesForm from "../Forms/SinglesForm";
import DoublesForm from "../Forms/DoublesForm";
import MixedForm from "../Forms/MixedForm";

const ReportMatchComponent = () => {

    const [eventType, setEventType] = useState('');

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
                    {eventType == 'Singles' && <SinglesForm></SinglesForm>}
                    {eventType == 'Doubles' && <DoublesForm />}
                    {eventType == 'Mixed' && <MixedForm />}


                </Form>
            </Container>
        </>
    )
}

export default ReportMatchComponent;