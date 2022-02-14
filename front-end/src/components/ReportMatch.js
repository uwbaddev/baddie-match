import { Container, Tabs, Tab, Row, Col, Form } from "react-bootstrap";
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
                    <Col> <p className='page-title'>REPORT MATCH</p></Col>
                </Row>
                <Form>
                    <Tabs activeKey={eventType} onSelect={type => setEventType(type)}>
                        <Tab eventKey="Singles" title="Singles" tabClassName="report-tab">
                            <SinglesForm />
                        </Tab>
                        <Tab eventKey="Doubles" title="Doubles" tabClassName="report-tab">
                            <DoublesForm />
                        </Tab>
                        <Tab eventKey="Mixed" title="Mixed" tabClassName="report-tab">
                            <MixedForm />
                        </Tab>
                    </Tabs>
                </Form>
            </Container>
        </>
    )
}

export default ReportMatchComponent;