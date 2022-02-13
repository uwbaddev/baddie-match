import { Container, Row, Col, Form, Button } from "react-bootstrap";



const SinglesForm = ({players, categories}) => {
    return (
        <>
            <Row>
                <Col className='page-header'>PLAYER ONE</Col>
                <Col className='page-header'> PLAYER TWO</Col>
            </Row>
            <Row>
                <Col>
                    <Form.Select >
                        <option>Choose a player</option>
                        {players.map((p, i) => <option key={i} value={p.first_name + " " + p.last_name}>{p.first_name} {p.last_name}</option>)}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select >
                        <option>Choose a player</option>
                        {players.map((p, i) => <option key={i} value={p.first_name + " " + p.last_name}>{p.first_name} {p.last_name}</option>)}
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
                <Col xs={6} md={9} >PLAYER ONE</Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='0' max='30'></Form.Control></Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='0' max='30'></Form.Control></Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='0' max='30'></Form.Control></Col>
            </Row>
            <hr></hr>
            <Row>
                <Col xs={6} md={9} >PLAYER TWO</Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='0' max='30'></Form.Control></Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='0' max='30'></Form.Control></Col>
                <Col xs={2} md={1} ><Form.Control type='number' min='0' max='30'></Form.Control></Col>
            </Row>

            <Row>
                <Col className='page-header'>CATEGORY</Col>
            </Row>
            <Row>
                <Col xs={6} md={4}>
                    <Form.Select>
                        <option>Choose an option</option>
                        {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
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

export default SinglesForm
