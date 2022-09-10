import { Container, Tabs, Tab, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import AddPlayerComponent from "./AddPlayerComponent";
import EditMatchesComponent from "./EditMatchesComponent";

const Admin = () => {
    const [adminType, setAdminType] = useState('')

    return (
        <>
            <Container>
                <Row>
                    <Col> <p className='page-title'>Admin</p></Col>
                </Row>
                <Form>
                    <Tabs activeKey={adminType} onSelect={type => setAdminType(type)}>
                        <Tab eventKey="AddPlayer" title="Add Player" tabClassName="report-tab">
                            <AddPlayerComponent />
                        </Tab>
                        <Tab eventKey="EditMatches" title="Edit Matches" tabClassName="report-tab">
                            <EditMatchesComponent />
                        </Tab>
                    </Tabs>
                </Form>
            </Container>
        </>
    )
}

export default Admin;
