import { Container, Tabs, Tab, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import AddPlayerComponent from "./AddPlayerComponent";
import EditMatchesComponent from "./EditMatchesComponent";

const Admin = () => {
    return (
        <>
            <Container>
                <Row>
                    <Col> <p className='page-title'>Admin</p></Col>
                </Row>
                <Form>
                    <Tabs defaultActiveKey="editMatches">
                    <Tab eventKey="editMatches" title="Edit Matches" tabClassName="report-tab">
                            <EditMatchesComponent />
                        </Tab>
                        <Tab eventKey="AddPlayer" title="Add Player" tabClassName="report-tab">
                            <AddPlayerComponent />
                        </Tab>
                    </Tabs>
                </Form>
            </Container>
        </>
    )
}

export default Admin;
