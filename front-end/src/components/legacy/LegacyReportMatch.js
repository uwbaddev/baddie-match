import { Container, Tabs, Tab, Row, Col, Form } from "react-bootstrap";
import SinglesForm from "../../Forms/SinglesForm";
import DoublesForm from "../../Forms/DoublesForm";
import MixedForm from "../../Forms/MixedForm";

const LegacyReportMatch = () => (
    <main className="legacy-site">
        <Container>
            <Row>
                <Col><p className="legacy-page-title">REPORT MATCH</p></Col>
            </Row>
            <Form id="legacy-match-form">
                <Tabs defaultActiveKey="Singles">
                    <Tab eventKey="Singles" title="Singles" tabClassName="legacy-report-tab">
                        <SinglesForm />
                    </Tab>
                    <Tab eventKey="Doubles" title="Doubles" tabClassName="legacy-report-tab">
                        <DoublesForm />
                    </Tab>
                    <Tab eventKey="Mixed" title="Mixed" tabClassName="legacy-report-tab">
                        <MixedForm />
                    </Tab>
                </Tabs>
            </Form>
        </Container>
    </main>
);

export default LegacyReportMatch;
