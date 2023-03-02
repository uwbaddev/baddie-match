import { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { AppContext } from "../Contexts/AppContext";
import { GetMatchesCount } from "../API/API"
import Moment from "moment"
import { PaginationControl } from 'react-bootstrap-pagination-control';

const ResultsPage = () => {
    // const [results, setResults] = useState({});
    const { players, queryPlayerResults, queryMatchPage } = useContext(AppContext)
    // const [selectedPlayer, setSelectedPlayer] = useState()
    const [matches, setMatches] = useState([])
    const [matchCount, setMatchCount] = useState(null);
    const [pageCount, setPageCount] = useState(null);
    const [activePage, setActivePage] = useState(1);

    function queryThenFormatMatches(number) {
        queryMatchPage(number)
            .then(data => {
                var matchesDict = {};

                data.forEach((d) => {
                    var date_obj = Moment.utc(d.last_edit, "YYYY-MM-DD-HH:mm:ss", true).local()

                    var key = date_obj.clone().startOf('day').unix()
                    if (!(key in matchesDict)) {
                        matchesDict[key] = [];
                    }
                    matchesDict[key].push({ date: date_obj, data: d });
                });

                for (var day in matchesDict) {
                    matchesDict[day].sort((a, b) => {
                        if (a.date.unix() > b.date.unix()) return -1
                        else if (a.date.unix() < b.date.unix()) return 1
                        else return 0
                    })
                }

                setMatches(matchesDict);
            })
    }

    useEffect(() => {
        fetch(GetMatchesCount, { method: 'GET' }).then(response => response.json())
            .then(data => { setMatchCount(parseInt(data)); setPageCount(parseInt(data) / 10 + 1) });
        queryThenFormatMatches(1)
    }, [])

    /*  function getResults(id) {
         queryPlayerResults(selectedPlayer.id).then(data => setMatches(data))
     } */

    function handlePageChange(number) {
        setActivePage(number);
        queryThenFormatMatches(number);
    }

    // TODO: someone with React experience pls do this better
    function formatPlayerSingles(match, index) {
        let player = players.find(x => x.id === match.players[index]).first_name

        if (match.winners === null) {
            return player
        }

        let winner = match.winners[0]
        if (winner === match.players[index]) {
            return (<b>{player}</b>)
        }
        return player
    }

    function formatPlayerDoubles(match, index1, index2) {
        let player1 = players.find(x => x.id === match.players[index1]).first_name
        let player2 = players.find(x => x.id === match.players[index2]).first_name

        let playerString = player1 + '/' + player2

        if (match.winners === null) {
            return playerString
        }

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

    return (
        <>
            <Container>
                <Row >
                    <Col className='page-title'>
                        RESULTS
                    </Col>
                </Row>
                <PaginationControl
                    page={activePage}
                    between={4}
                    total={matchCount}
                    limit={10}
                    changePage={(num) => handlePageChange(num)}
                    ellipsis={1}
                />
                {matches.length == 0 || players.length == 0 ? (
                    /* if no matches yet or if there are matches but no players */
                    <Col className='page-title'>
                        Retrieving data, please be patient...
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
                            return (
                                <div>
                                    <Row
                                        className='table-header'>{matches[k][0].date.format('ddd MMM D, YYYY')}
                                    </Row>
                                    {matches[k].map((match, i) => {
                                        return (
                                            <div>
                                                <Row>
                                                    <Col xs={2}>{match.date.format('h:mm a')}</Col>
                                                    <Col xs={6}>{formatPlayers(match.data)}</Col>
                                                    <Col xs={4}><p>{formatScores(match.data.score)}</p></Col>
                                                </Row>
                                                {matches[k].length === i + 1 ? <></> : <hr></hr>}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                        )}

                    </>
                )}
            </Container>
        </>
    )
}

export default ResultsPage;