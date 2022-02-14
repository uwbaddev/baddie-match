import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { ReportUrl } from "../API/API";
import { AppContext } from '../Contexts/AppContext'

const SinglesForm = () => {
    const { categories, players } = useContext(AppContext);

    const [matchObj, setMatchObj] = useState({
        event: 'Singles',
        player1Id: 0,
        player2Id: 0,
        score: [0, 0, 0, 0, 0, 0],
        category: ''
    })

    async function postResults() {
        if (matchObj.player1Id == 0 || matchObj.player2Id == 0) {
            return;
        }
        let counter = 0;
        for (let i = 0; i < 6; i++) {
            if (matchObj.score[i] == 21) {
                counter++;
            }
        }
        if (counter < 2) {
            return;
        }
        const matchForm = new FormData();
        matchForm.append('event', matchObj.event);
        matchForm.append('player1Id', matchObj.player1Id);
        matchForm.append('player2Id', matchObj.player2Id);
        matchForm.append('score', matchObj.score);
        matchForm.append('category', matchObj.category);

        fetch(ReportUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: matchForm
        }).then(response => response.json()).then(data => console.log(data)).catch(error => {
            console.error('Error: ', error);
        })
    }


    return (
        <>
            <Card className='form-section'>
                <Card.Header>
                    <Row>
                        <Col className='form-header'>PLAYER ONE</Col>
                        <Col className='form-header'> PLAYER TWO</Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                <Row>
                    <Col>
                        <Form.Select >
                            <option>Select</option>
                            {players.map((p, i) => <option key={i} value={p.first_name + " " + p.last_name}>{p.first_name} {p.last_name}</option>)}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Select >
                            <option>Select</option>
                            {players.map((p, i) => <option key={i} value={p.first_name + " " + p.last_name}>{p.first_name} {p.last_name}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>
                    <Row>
                        <Col className='form-header'>Score</Col>
                        <Col xs='auto' className='form-table-header score-col' >SET 1</Col>
                        <Col xs='auto' className='form-table-header score-col' >SET 2</Col>
                        <Col xs='auto' className='form-table-header score-col' >SET 3</Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col className='form-table-header' >PLAYER ONE</Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' type='number' inputMode='numeric' min='0' max='30'></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' type='number' inputMode='numeric' min='0' max='30'></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' type='number' inputMode='numeric' min='0' max='30'></Form.Control></Col>
                    </Row>
                    <hr></hr>
                    <Row className="align-items-center">
                        <Col className='form-table-header' >PLAYER TWO</Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' type='number' inputMode='numeric' min='0' max='30'></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' type='number' inputMode='numeric' min='0' max='30'></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' type='number' inputMode='numeric' min='0' max='30'></Form.Control></Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className='form-section'>
                <Card.Header>
                    <Row>
                        <Col className='form-header'>CATEGORY</Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <Form.Select>
                                <option>Choose an option</option>
                                {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <div className="form-section">
                <Button className='submit-button' type='submit'>
                    SUBMIT
                </Button>
            </div>
        </>
    )

}
export default SinglesForm;
