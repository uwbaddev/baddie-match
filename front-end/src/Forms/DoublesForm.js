import { useContext } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { AppContext } from "../Contexts/AppContext";



const DoublesForm = () => {
    const { players, categories } = useContext(AppContext);


    return (
        <>
            <Card className='form-section'>
                <Card.Header>
                    <Col className='form-header'>TEAM ONE</Col>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <Form.Select >
                                <option>Select</option>
                                {players.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select >
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
                            <Form.Select >
                                <option>Select</option>
                                {players.map((p, i) => <option key={i} value={p.id}>{p.first_name} {p.last_name}</option>)}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select >
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
                        <Col xs='auto' className='score-col' ><Form.Control type='number' min='0' max='30' inputMode='numeric'></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control type='number' min='0' max='30' inputMode='numeric'></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control type='number' min='0' max='30' inputMode='numeric'></Form.Control></Col>
                    </Row>
                    <hr></hr>
                    <Row className="align-items-center">
                        <Col className='form-table-header' >TEAM TWO</Col>
                        <Col xs='auto' className='score-col' ><Form.Control type='number' min='0' max='30' inputMode='numeric'></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control type='number' min='0' max='30' inputMode='numeric'></Form.Control></Col>
                        <Col xs='auto' className='score-col' ><Form.Control type='number' min='0' max='30' inputMode='numeric'></Form.Control></Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className='form-section'>
                <Card.Header>
                    <Col className='form-header'>CATEGORY</Col>
                </Card.Header>
                <Card.Body>
                    <Form.Select name="category">
                        <option>Choose an option</option>
                        {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </Form.Select>
                </Card.Body>
            </Card>
            
            <div className='form-section'>
                <Button className='submit-button' type='submit'>
                    Submit
                </Button>
            </div>
        </>
    )
}

export default DoublesForm;
