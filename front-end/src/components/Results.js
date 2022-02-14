import { useContext, useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { AppContext } from "../Contexts/AppContext";

const ResultsPage = () => {
    const [results, setResults] = useState({});
    const { players, matches, queryPlayerResults } = useContext(AppContext)
    const [selectedPlayer, setSelectedPlayer] = useState()
    // const [matches, setMatches] = useState([])

   /*  function getResults(id) {
        queryPlayerResults(selectedPlayer.id).then(data => setMatches(data))
    } */

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
                            <Form.Select type='select' /*onChange={(e) => getResults(e)*}*/>

                                <option>Choose a player</option>
                                {players && players.map((p, i) => <option key={i} value={p.first_name + " " + p.last_name}>{p.first_name} {p.last_name}</option>)}

                            </Form.Select>
                        </Col>
                    </Row>
                </Form>
                <hr></hr>
                {matches.map((p, i) => 
                <div>
                    <Row>
                        <Col xs={4}>{players.find(x => x.id === p.players[0]).first_name}</Col>
                        <Col xs={4}>vs.</Col>
                        <Col xs={4}>{players.find(x => x.id === p.players[1]).first_name}</Col>
                    </Row>

                    <Row>
                        <Col xs={6}>Winner: {players.find(x => x.id === p.winners[0]).first_name}</Col>
                        <Col xs={4}>{p.score.join(' ')}</Col>
                    </Row>
                    <hr></hr>
                </div>
                )}
            </Container>
        </>
    )
}

export default ResultsPage;