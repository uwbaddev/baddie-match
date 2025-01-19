import { Container, Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import { ReportMatchUrl, ReportUrl } from "../API/API";
import { AppContext } from '../Contexts/AppContext'
import * as ReactDOM from 'react-dom';

const SinglesForm = (formRef) => {
    const [bannerMessage, setBannerMessage] = useState('');

    const [show, setShow] = useState(true);

    const { categories, activePlayers } = useContext(AppContext);

    const [matchObj, setMatchObj] = useState({
        event: 'Singles',
        player1Id: 0,
        player2Id: 0,
        score: [0, 0, 0, 0, 0, 0],
        category: ''
    })

    async function postResults(e) {
        e.preventDefault();
        if (matchObj.player1Id == 0 || matchObj.player2Id == 0 ||
            matchObj.player1Id === matchObj.player2Id) {
            setBannerMessage('Invalid players selected!');
            return;
        }

        // TODO: complex score validation

        let zero_score = 0;
        for (let i = 0; i < 6; i++) {
            if (matchObj.score[i] === 0) zero_score++;
        }
        if (zero_score === 6) {
            setBannerMessage('Invalid scores inputted');
            return;
        }

        if (matchObj.category === '') {
            setBannerMessage('No category selected!');
            return;
        }

        fetch(ReportMatchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchObj)
        }).then(response => {
            if (response.status === 500) {
                response.text().then((text) => {
                    setBannerMessage("Error: " + text);
                });
            } else {
                response.text().then((text) => {
                    setBannerMessage(text);
                });
                var node = document.getElementById("match-form");
                ReactDOM.findDOMNode(node).reset();
            }
        }).catch(error => {
            console.log("Failed")
            console.error('Error: ', error);
        })
    }

    function handleMatchDataChange(evt) {
        if (evt.target.name == 'score') {
            let localObj = matchObj;
            localObj.score[evt.target.id] = parseInt(evt.target.value);
            setMatchObj(localObj);
        }
        else {
            setMatchObj({ ...matchObj, [evt.target.name]: evt.target.value })
        }
    }

    function SubmissionAlert() {
        const [show, setShow] = useState(true);
      
        if (show) {
          return (
            <Alert variant="info" onClose={() => setShow(false)} dismissible>
              <p>{bannerMessage}</p>
            </Alert>
          );
        }
        return null;
      }

    return (
        <>
            {bannerMessage && (<SubmissionAlert />)}
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
                                {activePlayers.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select name='player2Id' onChange={handleMatchDataChange}>
                                <option>Select</option>
                                {activePlayers.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>
                    <Row>
                        <Col className='form-header'>SCORE</Col>
                        <Col xs='auto' className='form-table-header score-col' >SET 1</Col>
                        <Col xs='auto' className='form-table-header score-col' >SET 2</Col>
                        <Col xs='auto' className='form-table-header score-col' >SET 3</Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col className='form-table-header' >PLAYER ONE</Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='0' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='2' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='4' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                    </Row>
                    <hr></hr>
                    <Row className="align-items-center">
                        <Col className='form-table-header' >PLAYER TWO</Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='1' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='3' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='5' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
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
                <Button className='submit-button' type='submit' onClick={(e) => postResults(e)}>
                    SUBMIT
                </Button>
            </div>
        </>
    )

}
export default SinglesForm;
