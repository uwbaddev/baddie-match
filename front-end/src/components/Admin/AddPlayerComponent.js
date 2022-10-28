import { useContext, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Collapse } from "react-bootstrap";
import { CreatePlayerUrl } from "../../API/API";
import { AppContext } from "../../Contexts/AppContext";



const AddPlayerComponent = () => {
    const [bannerMessage, setBannerMessage] = useState('');

    const [playerObj, setPlayerObj] = useState({
        firstName: '',
        lastName: '',
        eligibleYear: 0,
        sex: '',
    })

    async function postResults(e) {
        e.preventDefault();

        if (playerObj.firstName === '') {
            setBannerMessage('Please enter a first name');
            return;
        }

        if (playerObj.lastName === '') {
            setBannerMessage('Please enter a last name');
            return;
        }

        if (playerObj.eligibleYear === 0) {
            setBannerMessage('Please select a year');
            return;
        }

        if (playerObj.sex === '') {
            setBannerMessage('Please select a gender');
            return;
        }

        fetch(CreatePlayerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerObj)
        }).then(() => {
            setBannerMessage("Match Submitted")
        }).catch(error => {
            console.log("Failed")
            console.error('Error: ', error);
        })
    }

    function handleMatchDataChange(evt) {
        if (evt.target.name == 'firstname') {
            let localObj = playerObj;
            localObj.firstName = evt.target.value;
            setPlayerObj(localObj);
        } else if (evt.target.name == 'lastname') {
            let localObj = playerObj;
            localObj.lastName = evt.target.value;
            setPlayerObj(localObj);
        } else {
            setPlayerObj({ ...playerObj, [evt.target.name]: evt.target.value })
        }
    }
        

    function SubmissionAlert() {
        const [show, setShow] = useState(true);
      
        if (show) {
          return (
            <Alert variant="info" onClose={() => setShow(false)} dismissible>
              <p>{bannerMessage}</p>
            </Alert>
          );
        }
        return null;
      }

    return (
        <>
           {bannerMessage && (<SubmissionAlert />)}

           <Card className='form-section'>
                <Card.Header>
                    <Col className='form-header'>First Name</Col>
                </Card.Header>
                <Card.Body>
                    <Form.Control className='text-input' name='firstname' onChange={handleMatchDataChange}></Form.Control>
                </Card.Body>
            </Card>

            <Card className='form-section'>
                <Card.Header>
                    <Col className='form-header'>Last Name</Col>
                </Card.Header>
                <Card.Body>
                    <Form.Control className='text-input' name='lastname' onChange={handleMatchDataChange}></Form.Control>
                </Card.Body>
            </Card>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Col className='form-header'>ELIGIBILITY YEAR</Col>
                        </Card.Header>
                        <Card.Body>
                            <Form.Select name="eligibleYear" onChange={handleMatchDataChange}>
                                <option key={0} value={0}>Choose an option</option>
                                <option key={1} value={1}>1</option>
                                <option key={2} value={2}>2</option>
                                <option key={3} value={3}>3</option>
                                <option key={4} value={4}>4</option>
                                <option key={5} value={5}>5</option>
                            </Form.Select>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>
                            <Col className='form-header'>SEX</Col>
                        </Card.Header>
                        <Card.Body>
                            <Form.Select name="sex" onChange={handleMatchDataChange}>
                                <option key={0} value={''}>Choose an option</option>
                                <option key={1} value={'M'}>M</option>
                                <option key={2} value={'F'}>F</option>
                            </Form.Select>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className='form-section'>
                <Button className='submit-button' type='submit' onClick={(e) => postResults(e)}>
                    SUBMIT
                </Button>
            </div>
        </>
    )
}

export default AddPlayerComponent;
