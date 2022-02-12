import { Container, Row, Col, Form, Button } from "react-bootstrap";



const MixedForm = () => {
    //need to filter out player by gender
    return (
        <>
            <Row>
                <Col className='page-header'>TEAM ONE</Col>
            </Row>
            <Row>
                <Col>MALE</Col>
                <Col>FEMALE</Col>
            </Row>
            <Row>
                <Col>
                    <Form.Select >
                        <option value='Darren Choi'>Darren Choi</option>
                        <option value='Angela Chen'>Angela Chen</option>
                        <option value="Jenny Lei">Jenny Lei</option>
                        <option value="Ivan Cheng">Ivan Cheng</option>
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select >
                        <option value='Darren Choi'>Darren Choi</option>
                        <option value='Angela Chen'>Angela Chen</option>
                        <option value="Jenny Lei">Jenny Lei</option>
                        <option value="Ivan Cheng">Ivan Cheng</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col className='page-header'> TEAM TWO</Col>
            </Row>
            <Row>
                <Col>MALE</Col>
                <Col>FEMALE</Col>
            </Row>
            <Row>
                <Col>
                    <Form.Select >
                        <option value='Darren Choi'>Darren Choi</option>
                        <option value='Angela Chen'>Angela Chen</option>
                        <option value="Jenny Lei">Jenny Lei</option>
                        <option value="Ivan Cheng">Ivan Cheng</option>
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select >
                        <option value='Darren Choi'>Darren Choi</option>
                        <option value='Angela Chen'>Angela Chen</option>
                        <option value="Jenny Lei">Jenny Lei</option>
                        <option value="Ivan Cheng">Ivan Cheng</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col className='page-header'>Score</Col>
            </Row>
            <Row>
                <Col xs={6} md={9} ></Col>
                <Col xs={2} md={1} >GAME 1</Col>
                <Col xs={2} md={1} >GAME 2</Col>
                <Col xs={2} md={1} >GAME 3</Col>
            </Row>
            <Row>
                <Col xs={6} md={9} >TEAM ONE</Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='1' max='30'></Form.Control></Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='1' max='30'></Form.Control></Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='1' max='30'></Form.Control></Col>
            </Row>
            <hr></hr>
            <Row>
                <Col xs={6} md={9} >TEAM TWO</Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='1' max='30'></Form.Control></Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='1' max='30'></Form.Control></Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='1' max='30'></Form.Control></Col>
            </Row>

            <Row>
                <Col className='page-header'>CATEGORY</Col>
            </Row>
            <Row>
                <Col xs={6} md={4}>
                    <Form.Select>
                        <option value="OUA">OUA</option>
                        <option value='UniNats'>University Nationals</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button type='submit'>
                        Submit
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default MixedForm;
