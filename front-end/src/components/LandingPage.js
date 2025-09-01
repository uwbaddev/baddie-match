import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useState, useEffect, useContext } from "react"
import { AppContext } from "../Contexts/AppContext";
import SeasonSelector from "./SeasonSelector";

const LandingPage = () => {
    const { queryStats } = useContext(AppContext);
    const [stats, setStats] = useState([]);
    const [singlesRankings, setSinglesRankings] = useState([]);
    const [doublesRankings, setDoublesRankings] = useState([]);
    const [mixedRankings, setMixedRankings] = useState([]);
    const [seasonStart, setSeasonStart] = useState('2025-09-01');
    const [seasonEnd, setSeasonEnd] = useState('2026-08-31');

    const getStats = (newSeasonStart, newSeasonEnd) => {
        queryStats(newSeasonStart, newSeasonEnd).then(data => {
            setStats(data)
        })
    }

    const updateStats = (category, newStats) => {
        var results = newStats.map(s => {
            let percentage = 0;
            let category_wins = category + '_wins';
            let category_losses = category + '_losses';
            if (s[category_wins] + s[category_losses] != 0) {
                percentage = Math.round((s[category_wins] / (s[category_wins] + s[category_losses])) * 100);
            }
            return {
                name: s.name,
                percentage: percentage,
                wins: s[category_wins],
                losses: s[category_losses],
            }

        })
        var items = Object.keys(results).map(function (key) {
            return [key, results[key]];
        });
        items.sort(function (first, second) {
            return second[1].percentage - first[1].percentage;
        });
        if (category === 'singles') {
            setSinglesRankings(items)
        } else if (category === 'doubles') {
            setDoublesRankings(items)
        } else {
            setMixedRankings(items)
        }
    }

    useEffect(() => {
        getStats(seasonStart, seasonEnd);
    }, [seasonStart, seasonEnd])

    useEffect(() => {
        updateStats('singles', stats);
        updateStats('doubles', stats);
        updateStats('mixed', stats);
    }, [stats])

    const Rankings = (event) => {
        return <ListGroup as="ol" numbered>
            {event.filter(r => r[1].wins + r[1].losses > 4).slice(0, 10).map((r, i) => {
                return <ListGroup.Item>
                    <Row>
                        <Col xs={6}>{i + 1}. {r[1].name}</Col>
                        <Col xs={6}>{r[1].percentage}% (W: {r[1].wins}, L: {r[1].losses})</Col>
                    </Row>
                </ListGroup.Item>
            })
            }
        </ListGroup>
    }

    return (
        <>
            <Container>
                <Row className="page-title">
                    Welcome to the official site of the Waterloo Warriors Varsity Badminton Team Statistics!
                </Row>
                <SeasonSelector
                    setStart={(start) => setSeasonStart(start)}
                    setEnd={(end) => setSeasonEnd(end)}
                />
                <Row className="page-title">
                    Current Rankings By Win %:
                </Row>
                <Container>
                    <Row>
                        <Col sm={12} md={6} >
                            <div className='table-header'>Singles Rankings</div>
                            {Rankings(singlesRankings)}
                        </Col>
                        <Col sm={12} md={6} >
                            <div className='table-header'>Doubles Rankings</div>
                            {Rankings(doublesRankings)}
                        </Col>
                        <Col sm={12} md={6} >
                            <div className='table-header'>Mixed Rankings</div>
                            {Rankings(mixedRankings)}
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    )
}

export default LandingPage