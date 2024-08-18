import { Container, Tabs, Tab, Row, Col, Form } from "react-bootstrap";
import '../index.css';
import React from 'react';
import temporaryPfp from '../pfp images/temporaryPfp.png';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react"; 
import { PlayerIdUrl } from '../API/API';


const ProfilePage = () => {
    const [playerData, setPlayerData] = useState(null);
    let { playerId } = useParams();


    useEffect(() => {

        if (playerId) {
            const playerUrl = PlayerIdUrl(playerId);
            console.log(playerId)
            console.log("fetching");

            fetch(playerUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })

            .catch(error => {
                console.error('error', error);
            });

        }
    
    
      }, [playerId]);


    function showMore() {
        alert("will show more info eventually lol");

    }

    return (
        <>
        <Container fluid="true">
            <Row>
                <Col className='page-title'>
                    Player Profile 
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={3} >
                </Col>
                <Col>
                <div className='table-header'>Emily Xia </div> 
                </Col>
                <Col sm={12} md={3} >
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={3} >
                </Col>
                <Col sm={12} md={3} >
                    <div className="text-center">
                        <img src={temporaryPfp} alt="Pfp" width={250} height={250}>
                        </img>
                    </div>               
                </Col>
                <Col sm={12} md={3} >
                    <div className='player-info'>Year: First Year</div>                
                    <div className='player-info'>Play R or L: R</div>                
                    <div className='player-info'>Event: tbd help</div>                
                </Col>
                <Col sm={12} md={3} >
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={3} >
                </Col>
                <Col>
                <div className='recent-matches-with'>Recent matches with Emily Xia</div> 
                </Col>
                <Col sm={12} md={3} >
                </Col>
                <div className='divider'></div>
            </Row>

            <Row>
                <Col sm={12} md={3}></Col>
                <Col sm={12} md={1}>
                    <div className='recent-profile-matches'>12:00 am</div>
                </Col>
                <Col sm={12} md={4}>
                    <div className='recent-profile-matches'><b>Emily Xia</b> vs. Emily Xia</div>
                </Col>
                <Col sm={12} md={2}>
                    <div className='recent-profile-matches'>21-0 21-0</div>
                </Col>
                <Col sm={12} md={3} ></Col>
            </Row>
            <Row>
                <div className='divider'></div>
            </Row>
            <Row>
                <Col sm={12} md={3}></Col>
                <Col sm={12} md={1}>
                    <div className='recent-profile-matches'>1:00 am</div>
                </Col>
                <Col sm={12} md={4}>
                    <div className='recent-profile-matches'><b>Emily Xia/Emily Xia</b> vs. Emily Xia/Emily Xia</div>
                </Col>
                <Col sm={12} md={2}>
                    <div className='recent-profile-matches'>21-0 21-0</div>
                </Col>
                <Col sm={12} md={3} ></Col>
            </Row>
            <Row>
            <div className='divider'></div>
            </Row>
            <Row>
                <Col sm={12} md={3}></Col>
                <Col sm={12} md={6}>
                    <button className='show-more-btn' onClick={showMore}>Show more ...</button>
                </Col>
                <Col sm={12} md={3}></Col>
            </Row>

        </Container>
        </>
    )
}

export default ProfilePage;