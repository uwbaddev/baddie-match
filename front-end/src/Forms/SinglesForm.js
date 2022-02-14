import { Container, Row, Col, Form, Button } from "react-bootstrap";
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

    async function postResults(e) {
        e.preventDefault();
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
            setMatchObj(localObj);
        }
        else {
            setMatchObj({ ...matchObj, [evt.target.name]: evt.target.value })
        }
    }


    return (
        <>
            <Row>
                <Col className='page-header'>PLAYER ONE</Col>
                <Col className='page-header'> PLAYER TWO</Col>
            </Row>
            <Row>
                <Col>
                    <Form.Select name='player1Id' onChange={handleMatchDataChange}>
                        <option>Choose a player</option>
                        {players.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select name='player2Id' onChange={handleMatchDataChange}>
                        <option>Choose a player</option>
                        {players.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col className='page-header'>Score</Col>
            </Row>
            <Row>
                <Col xs={3} md={9} ></Col>
                <Col xs={3} md={1} >GAME 1</Col>
                <Col xs={3} md={1} >GAME 2</Col>
                <Col xs={3} md={1} >GAME 3</Col>
            </Row>
            <Row>
                <Col xs={3} md={9} >PLAYER ONE</Col>
                <Col xs={3} md={1} ><Form.Control name='score' id='0' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                <Col xs={3} md={1} ><Form.Control name='score' id='2' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                <Col xs={3} md={1} ><Form.Control name='score' id='4' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
            </Row>
            <hr></hr>
            <Row>
                <Col xs={3} md={9} >PLAYER TWO</Col>
                <Col xs={3} md={1} ><Form.Control name='score' id='1' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                <Col xs={3} md={1} ><Form.Control name='score' id='3' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
                <Col xs={3} md={1} ><Form.Control name='score' id='5' type='number' inputMode='numeric' min='0' max='30' onChange={handleMatchDataChange}></Form.Control></Col>
            </Row>

            <Row>
                <Col className='page-header'>CATEGORY</Col>
            </Row>
            <Row>
                <Col xs={10} md={4}>
                    <Form.Select name="category" onChange={handleMatchDataChange}>
                        <option>Choose an option</option>
                        {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button className='submit-button' type='submit' onClick={(e) => postResults(e)}>
                        SUBMIT
                    </Button>
                </Col>
            </Row>
        </>
    )

}
export default SinglesForm;
