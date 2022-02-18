import { useContext, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { ReportMatchUrl } from "../API/API";
import { AppContext } from "../Contexts/AppContext";



const DoublesForm = () => {
    const [bannerMessage, setBannerMessage] = useState('');

    const { players, categories } = useContext(AppContext);

    const [matchObj, setMatchObj] = useState({
        event: 'Doubles',
        player1Id: 0,
        player2Id: 0,
        player3Id: 0,
        player4Id: 0,
        score: [0, 0, 0, 0, 0, 0],
        category: ''
    })

    async function postResults(e) {
        e.preventDefault();
        if (matchObj.player1Id == 0 || matchObj.player2Id == 0 ||
            matchObj.player3Id == 0 || matchObj.player4Id == 0 ||
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

        let scoreString = '[' + matchObj.score.join(',') + ']';
        const matchForm = new FormData();
        matchForm.append('event', matchObj.event);
        matchForm.append('player1Id', matchObj.player1Id);
        matchForm.append('player2Id', matchObj.player2Id);
        matchForm.append('player3Id', matchObj.player3Id);
        matchForm.append('player4Id', matchObj.player4Id);
        matchForm.append('score', scoreString);
        matchForm.append('category', matchObj.category);

        fetch(ReportMatchUrl, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            body: matchForm
        }).then(response => {
            setBannerMessage("Match Submitted")
        }).catch(error => {
            console.log("Failed")
            console.error('Error: ', error);
        })
    }

    function handleMatchDataChange(evt) {
        if (evt.target.name == 'score') {
            let localObj = matchObj;
            localObj.score[evt.target.id] = evt.target.value;
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
                    <Col className='form-header'>TEAM ONE</Col>
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

                <Card.Header>
                    <Col className='form-header'>TEAM TWO</Col>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <Form.Select name='player3Id' onChange={handleMatchDataChange}>
                                <option>Select</option>
                                {players.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select name='player4Id' onChange={handleMatchDataChange}>
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
