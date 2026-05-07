import { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Dropdown, DropdownButton } from "react-bootstrap";
import { AppContext } from "../../Contexts/AppContext";
import Moment from "moment";
import { PaginationControl } from 'react-bootstrap-pagination-control';
import LegacySeasonSelector from "./LegacySeasonSelector";

const LegacyResults = () => {
    const { players, queryMatchPage } = useContext(AppContext);
    const [matches, setMatches] = useState({});
    const [recordCount, setRecordCount] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [seasonStart, setSeasonStart] = useState('2025-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2026-08-31');

    useEffect(() => {
        queryMatchPage(activePage, recordsPerPage, seasonStart, seasonEnd)
            .then(data => {
                const matchesDict = {};
                data.records.forEach((d) => {
                    const dateObj = Moment.utc(d.last_edit, "YYYY-MM-DD-HH:mm:ss", true).local();
                    const key = dateObj.clone().startOf('day').unix();
                    if (!(key in matchesDict)) {
                        matchesDict[key] = [];
                    }
                    matchesDict[key].push({ date: dateObj, data: d });
                });

                for (const day in matchesDict) {
                    matchesDict[day].sort((a, b) => b.date.unix() - a.date.unix());
                }

                setMatches(matchesDict);
                setRecordCount(data.metadata.recordCount);
            });
    }, [activePage, recordsPerPage, seasonStart, seasonEnd, queryMatchPage]);

    function formatPlayerSingles(match, index) {
        const player = players.find(x => x.id === match.players[index]);
        if (!player) return 'Player';
        const playerString = `${player.first_name} ${player.last_name}`;

        if (match.winners === null) {
            return playerString;
        }

        const winner = match.winners[0];
        if (winner === match.players[index]) {
            return <b>{playerString}</b>;
        }
        return playerString;
    }

    function formatPlayerDoubles(match, index1, index2) {
        const player1 = players.find(x => x.id === match.players[index1]);
        const player2 = players.find(x => x.id === match.players[index2]);
        if (!player1 || !player2) return 'Team';

        const playerString = `${player1.first_name} ${player1.last_name}/${player2.first_name} ${player2.last_name}`;

        if (match.winners === null) {
            return playerString;
        }

        if (match.winners.includes(match.players[index1])) {
            return <b>{playerString}</b>;
        }
        return playerString;
    }

    function formatPlayers(match) {
        if (match.event === 'Singles') {
            return <p>{formatPlayerSingles(match, 0)} vs. {formatPlayerSingles(match, 1)}</p>;
        }
        return <p>{formatPlayerDoubles(match, 0, 1)} vs. {formatPlayerDoubles(match, 2, 3)}</p>;
    }

    function formatScores(scores) {
        let scoreString = '';
        for (let i = 0; i < scores.length; i++) {
            if (i % 2 === 0) {
                if (scores[i] === 0) return scoreString;
                scoreString += `${scores[i]}-`;
            } else {
                scoreString += `${scores[i]}   `;
            }
        }
        return scoreString;
    }

    return (
        <main className="legacy-site">
            <Container>
                <Row>
                    <Col className="legacy-page-title">
                        RESULTS
                    </Col>
                    <LegacySeasonSelector
                        setStart={(start) => setSeasonStart(start)}
                        setEnd={(end) => setSeasonEnd(end)}
                    />
                    <Col className="legacy-pagination">
                        <PaginationControl
                            page={activePage}
                            between={2}
                            total={recordCount}
                            limit={recordsPerPage}
                            last
                            changePage={(num) => setActivePage(num)}
                            ellipsis={1}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className="legacy-pagination">
                        <DropdownButton id="perPageSelect" title={recordsPerPage}>
                            {[5, 10, 15, 20].map(value => (
                                <Dropdown.Item
                                    key={value}
                                    value={value}
                                    onClick={(event) => {
                                        setRecordsPerPage(Number(event.target.text));
                                        setActivePage(1);
                                    }}
                                >
                                    {value}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Col>
                </Row>
                {Object.keys(matches).length === 0 || players.length === 0 ? (
                    <Col className="legacy-page-title">
                        Retrieving data, please be patient...
                    </Col>
                ) : (
                    <>
                        {Object.keys(matches).sort().reverse().map((k) => (
                            <div key={k}>
                                <Row className="legacy-table-header">
                                    {matches[k][0].date.format('ddd MMM D, YYYY')}
                                </Row>
                                {matches[k].map((match, i) => (
                                    <div key={match.data.id}>
                                        <Row>
                                            <Col xs={2}>{match.date.format('h:mm a')}</Col>
                                            <Col xs={6}>{formatPlayers(match.data)}</Col>
                                            <Col xs={4}><p>{formatScores(match.data.score)}</p></Col>
                                        </Row>
                                        {matches[k].length === i + 1 ? null : <hr />}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </Container>
        </main>
    );
};

export default LegacyResults;
