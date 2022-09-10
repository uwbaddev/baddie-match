import { Container, Tabs, Tab, Row, Col, Form } from "react-bootstrap";
import '../index.css';
import { useRef } from "react";
import SinglesForm from "../Forms/SinglesForm";
import DoublesForm from "../Forms/DoublesForm";
import MixedForm from "../Forms/MixedForm";

const ReportMatchComponent = () => {
    return (
        <>
            <Container>
                <Row>
                    <Col> <p className='page-title'>REPORT MATCH</p></Col>
                </Row>
                <Form id="match-form">
                    <Tabs defaultActiveKey="Singles">
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