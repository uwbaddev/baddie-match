import { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { AppContext } from "../Contexts/AppContext";
import { GetMatchesCount } from "../API/API"
import Moment from "moment"
import { PaginationControl } from 'react-bootstrap-pagination-control';

const ResultsPage = () => {
    // const [results, setResults] = useState({});
    const { players, queryPlayerResults, queryMatchPage } = useContext(AppContext)
    // const [selectedPlayer, setSelectedPlayer] = useState()
    const [matches, setMatches] = useState([])
    const [recordCount, setRecordCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10)


    function queryThenFormatMatches(newActivePage, newRecordsPerPage) {
        queryMatchPage(newActivePage, newRecordsPerPage)
            .then(data => {
                var matchesDict = {};
                data.records.forEach((d) => {
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
                setRecordCount(data.metadata.recordCount)
                setPageCount(data.metadata.pageCount)
                setRecordsPerPage(data.metadata.recordsPerPage)
            })
    }

    useEffect(() => {
        queryThenFormatMatches(1)
    }, [])

    useEffect(() => {
        queryThenFormatMatches(activePage, recordsPerPage)
    }, [activePage, recordsPerPage])


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
                <Row>
                    <Col className='pagination'>
                        <PaginationControl
                            page={activePage}
                            between={2}
                            total={recordCount}
                            //leave as magic number idk why it works :/
                            limit={recordsPerPage}
                            last={true}
                            changePage={(num) => setActivePage(num)}
                            ellipsis={1}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className='pagination'>
                        <DropdownButton id='perPageSelect' title={recordsPerPage}>
                            <Dropdown.Item key='5' value='5' onClick={(event) => {
                                setRecordsPerPage(event.target.text)
                            }}>5</Dropdown.Item>
                            <Dropdown.Item key='10' value='10' onClick={(event) => {
                                setRecordsPerPage(event.target.text)
                            }}>10</Dropdown.Item>
                            <Dropdown.Item key='15' value='15' onClick={(event) => {
                                setRecordsPerPage(event.target.text)
                            }}>15</Dropdown.Item>
                            <Dropdown.Item key='20' value='20' onClick={(event) => {
                                setRecordsPerPage(event.target.text)
                            }}>20</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
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
