import { useContext, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { AppContext } from "../../Contexts/AppContext";
import { MatchUrl } from "../../API/API"

const EditMatchesComponent = () => {
    // const [results, setResults] = useState({});
    const { players, matches, queryPlayerResults } = useContext(AppContext)
    // const [selectedPlayer, setSelectedPlayer] = useState()
    // const [matches, setMatches] = useState([])

   /*  function getResults(id) {
        queryPlayerResults(selectedPlayer.id).then(data => setMatches(data))
    } */

    // TODO: someone with Reaact experience pls do this better
    function formatPlayerSingles(match, index) {
        let winner = match.winners[0]
        let player = players.find(x => x.id === match.players[index]).first_name

        if (winner === match.players[index]) {
            return (<b>{player}</b>)
        }
        return player
    }

    function formatPlayerDoubles(match, index1, index2) {
        let player1 = players.find(x => x.id === match.players[index1]).first_name
        let player2 = players.find(x => x.id === match.players[index2]).first_name

        let playerString = player1 + '/' + player2

        if (match.winners.includes(match.players[index1])) {
            return (<b>{playerString}</b>)
        }
        return playerString
    }


    function formatPlayers(match) {
        if (match.event === 'Singles') {
            return (
                <p>{formatPlayerSingles(match, 0)} vs. {formatPlayerSingles(match, 1)}</p>
            )
        } else {
            return (
                <p>{formatPlayerDoubles(match, 0, 1)} vs. {formatPlayerDoubles(match, 2, 3)}</p>
            )
        }
        
    }

    function formatScores(scores) {
        let scoreString = ''
        for (let i = 0; i < scores.length; i++) {
            if (i % 2 === 0) {
                if (scores[i] == 0) return scoreString
                scoreString += scores[i] + '-'
            } else {
                scoreString += scores[i] + '   '
            }
        }
        return scoreString;
    }

    async function postDeleteMatch(e, matchId) {
        e.preventDefault();
        fetch(MatchUrl(matchId), { method: 'DELETE' })
            .then(response => {
                console.log(response)
                window.location.reload();
            })
    }

    return (
        <>
            <Container>
                { matches.length == 0 || players.length == 0 ? (
                    /* if no matches yet or if there are matches but no players */
                    <Col className='page-title'>
                        Retreiving data, please be patient...
                    </Col>
                ) : (
                    <>
                        {/* <Row>
                            <Col className='page-header'>
                                Pick a player for results
                            </Col>
                        </Row>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Select type='select' /*onChange={(e) => getResults(e)*}>

                                        <option>Choose a player</option>
                                        {players && players.map((p, i) => <option key={i} value={p.first_name + " " + p.last_name}>{p.first_name} {p.last_name}</option>)}

                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form> */}
                        {Object.keys(matches).sort().reverse().map((k) => {
                           return(
                                <div>
                                    <Row 
                                        className='table-header'>{matches[k][0].date.format('ddd MMM D, YYYY')}
                                    </Row>
                                    {matches[k].map((match, i) => {
                                            return (
                                                <div>
                                                 <Row>
                                                <Col xs={1}>{match.date.local().format('H:mm')}</Col>
                                                <Col xs={5}>{formatPlayers(match.data)}</Col>
                                                <Col xs={2}><p>{formatScores(match.data.score)}</p></Col>
                                                <Col xs={2} onClick={(e) => postDeleteMatch(e, match.data.id)}> <Button className="delete-button">Delete</Button></Col>
                                                </Row>
                                            {matches[k].length === i + 1 ? <></> : <hr></hr>}
                                                </div>
                                            )
                                    })}
                                </div>
                           )
                        })}
                    </>
                )}
            </Container>
        </>
    )
}

export default EditMatchesComponent;
