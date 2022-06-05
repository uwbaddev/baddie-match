import { Container, Card, Row, Col, Form, Button, FormLabel } from "react-bootstrap";
import { useState, useContext } from "react";
import { ReportMatchUrl, ReportUrl } from "../API/API";
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
            //currently only works if no deuces, so have to check this out
            if (matchObj.score[i] >= 21) {
                counter++;
            }
        }
        if (counter < 2) {
            return;
        }
        let scoreString = '[';
        for (let i = 0; i < 6; i++) {
            if (i == 5) {
                scoreString = scoreString + matchObj.score[i] + ']';
                break;
            }
            scoreString = scoreString + matchObj.score[i] + ',';
        }
        console.log(matchObj);
        const matchForm = new FormData();
        matchForm.append('event', matchObj.event);
        matchForm.append('player1Id', matchObj.player1Id);
        matchForm.append('player2Id', matchObj.player2Id);
        matchForm.append('score', scoreString);
        matchForm.append('category', matchObj.category);

        fetch(ReportMatchUrl, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            body: matchForm
        }).then(response => response.json()).then(data => console.log(data)).catch(error => {
            console.error('Error: ', error);
        })
    }
    function handleMatchDataChange(evt) {

        if (evt.target.name == 'score') {
            let localObj = matchObj;
            localObj.score[evt.target.id] = evt.target.value;
            if (evt.target.id % 2 == 0 && evt.target.value < 20) {
                localObj.score[parseInt(evt.target.id) + 1] = JSON.stringify(21);
            }
            else if (evt.target.id % 2 == 0 && evt.target.value >= 20) {
                localObj.score[parseInt(evt.target.id) + 1] = JSON.stringify(evt.target.value + 2);
            }
            else if (evt.target.id % 2 == 1 && evt.target.value < 20) {
                localObj.score[parseInt(evt.target.id) - 1] = JSON.stringify(21);
            }
            else if (evt.target.id % 2 == 1 % evt.target.value >= 20) {
                localObj.score[parseInt(evt.target.id) - 1] = JSON.stringify(evt.target.value + 2);
            }
            setMatchObj(localObj);
            console.log(localObj);
        }
        else {
            setMatchObj({ ...matchObj, [evt.target.name]: evt.target.value })
        }
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
                            <Form.Select name='player1Id' onChange={handleMatchDataChange}>
                                <option>Select</option>
                                {players.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select name='player2Id' onChange={handleMatchDataChange}>
                                <option>Select</option>
                                {players.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
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
                        <Col xs='auto' className='score-col' >
                            <Form.Label>
                                <Form.Control className='score-input' name='score' id='0' type='number' min='0' max='30' onChange={handleMatchDataChange} value={matchObj.score[0]}></Form.Control>
                            </Form.Label>
                        </Col>
                        <Col xs='auto' className='score-col' >
                            <Form.Label>
                                <Form.Control className='score-input' name='score' id='2' type='number' min='0' max='30' onChange={handleMatchDataChange} value={matchObj.score[2]}></Form.Control>
                            </Form.Label>
                        </Col>
                        <Col xs='auto' className='score-col' >
                            <Form.Label>
                                <Form.Control className='score-input' name='score' id='4' type='number' min='0' max='30' onChange={handleMatchDataChange} value={matchObj.score[4]}></Form.Control>
                            </Form.Label>
                        </Col>
                    </Row>
                    <hr></hr>
                    <Row className="align-items-center">
                        <Col className='form-table-header' >PLAYER TWO</Col>
                        <Col xs='auto' className='score-col' >
                            <Form.Label>
                                <Form.Control className='score-input' name='score' id='1' type='number' min='0' max='30' value={matchObj.score[1]} onChange={handleMatchDataChange} ></Form.Control>
                            </Form.Label>
                        </Col>
                        <Col xs='auto' className='score-col' >
                            <Form.Label>
                                <Form.Control className='score-input' name='score' id='3' type='number' min='0' max='30' value={matchObj.score[3]} onChange={handleMatchDataChange} ></Form.Control>
                            </Form.Label>
                        </Col>
                        <Col xs='auto' className='score-col' >
                            <Form.Label>
                                <Form.Control className='score-input' name='score' id='5' type='number' min='0' max='30' value={matchObj.score[5]} onChange={handleMatchDataChange} ></Form.Control>
                            </Form.Label>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className='form-section'>
                <Card.Header>
                    <Col className='form-header'>CATEGORY</Col>
                </Card.Header>
                <Card.Body>
                    <Form.Select name="category" onChange={handleMatchDataChange}>
                        <option>Choose an option</option>
                        {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </Form.Select>
                </Card.Body>
            </Card>

            <div className="form-section">
                <Button className='submit-button' type='submit' onClick={e => postResults()}>
                    SUBMIT
                </Button>
            </div>
        </>
    )

}
export default SinglesForm;
