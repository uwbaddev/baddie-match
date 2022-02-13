import { useState } from "react";
import { Col, Container, Row, Form, FormControl, FormSelect } from "react-bootstrap";
import { ResultsURL } from "../API/API";

const ResultsPage = () => {
    const [results, setResults] = useState({});

    async function getResults() {
        const response = await fetch(ResultsURL, {
            method: 'GET',
        }).then(response => response.json()).then(data => { setResults(response); console.log(data) })
    }
    return (
        <>
            <Container>
                <Row >
                    <Col className='page-title'>
                        RESULTS
                    </Col>
                </Row>
                <Row>
                    <Col className='page-header'>
                        Pick a player for results
                    </Col>
                </Row>
                <Form>
                    <Row>
                        <Col>
                            <Form.Select type='select' onChange={(e) => getResults(e)}>
                                <option>Choose a player</option>
                                <option value='Darren Choi'>Darren Choi</option>
                                <option value='Angela Chen'>Angela Chen</option>
                                <option value="Jenny Lei">Jenny Lei</option>
                                <option value="Ivan Cheng">Ivan Cheng</option></Form.Select>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    )
}

export default ResultsPage;