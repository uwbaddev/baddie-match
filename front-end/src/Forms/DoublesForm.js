import { useContext, useState, useRef } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { ReportMatchUrl } from "../API/API";
import { AppContext } from "../Contexts/AppContext";
import * as ReactDOM from 'react-dom';

const DoublesForm = () => {
    const [bannerMessage, setBannerMessage] = useState('');
    const [cooldown, setCooldown] = useState(false);

    const { activePlayers, categories } = useContext(AppContext);
    const formElementRef = useRef(null);

    const initialMatch = {
        event: 'Doubles',
        player1Id: 0,
        player2Id: 0,
        player3Id: 0,
        player4Id: 0,
        score: [0, 0, 0, 0, 0, 0],
        category: ''
    };

    const [matchObj, setMatchObj] = useState(initialMatch);

    const resetForm = () => {
        setMatchObj(initialMatch);
    };

    async function postResults(e) {
        e.preventDefault();

        if (cooldown) {
            setBannerMessage('Please wait before submitting again...');
            return;
        }

        if (matchObj.player1Id === 0 || matchObj.player2Id === 0 ||
            matchObj.player3Id === 0 || matchObj.player4Id === 0 ||
            matchObj.player1Id === matchObj.player2Id) {
            setBannerMessage('Invalid players selected!');
            return;
        }

        const zeroScoreCount = matchObj.score.filter(s => s === 0).length;
        if (zeroScoreCount === 6) {
            setBannerMessage('Invalid scores inputted');
            return;
        }

        if (matchObj.category === '') {
            setBannerMessage('No category selected!');
            return;
        }

        setCooldown(true);

        const response = await fetch(ReportMatchUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matchObj)
        });

        const text = await response.text();

        if (response.status === 500) {
            setBannerMessage("Error: " + text);
        } else {
            const node = document.getElementById("match-form");
            ReactDOM.findDOMNode(node).reset();
            resetForm();
            setBannerMessage(text);
        }
        setTimeout(() => setCooldown(false), 3000);
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
        if (!bannerMessage || !show) return null;

        return (
            <Alert variant="info" dismissible onClose={() => setShow(false)}>
                <p>{bannerMessage}</p>
            </Alert>
        );
    }

    return (
        <>
            {bannerMessage && (<SubmissionAlert />)}
            <Card className='form-section'>
                <Card.Header>
                    <Col className='form-header'>TEAM ONE</Col>
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

                <Card.Header>
                    <Col className='form-header'>TEAM TWO</Col>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <Form.Select name='player3Id' onChange={handleMatchDataChange}>
                                <option>Select</option>
                                {activePlayers.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select name='player4Id' onChange={handleMatchDataChange}>
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
                        <Col className='form-table-header' >TEAM ONE</Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='0' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='2' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control className='score-input' name='score' id='4' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                    </Row>
                    <hr></hr>
                    <Row className="align-items-center">
                        <Col className='form-table-header' >TEAM TWO</Col>
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
            
            <div className='form-section'>
                <Button className='submit-button' type='submit' onClick={(e) => postResults(e)}>
                    SUBMIT
                </Button>
            </div>
        </>
    )
}

export default DoublesForm;
