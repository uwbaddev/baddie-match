import { useState } from 'react';
import { Link } from 'react-router-dom'
import { Col, Container, Nav, Navbar, Row, Offcanvas } from 'react-bootstrap'
import { DropdownIcon } from '../icons/MainDropdown.js';
import '../index.css'

const Header = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <Navbar fixed="sticky" className='header-panel' expand={false}>
                <Container fluid>
                    <Navbar.Brand href="/" className='header'>WATERLOO WARRIORS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={ () => setExpanded(!expanded) } />
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                        show={expanded}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">WARRIORS</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 page-header pe-3">
                                <Nav.Link as={Link} to="/" onClick={ () => setExpanded(false) }>HOME</Nav.Link>
                                <Nav.Link as={Link} to="/report" onClick={ () => setExpanded(false) }>REPORT MATCH</Nav.Link>
                                <Nav.Link as={Link} to="/results" onClick={ () => setExpanded(false) }>RESULTS</Nav.Link>
                                <Nav.Link as={Link} to="/elo" onClick={ () => setExpanded(false) }>ELO RANKINGS</Nav.Link>
                                {/* <Nav.Link as={Link} to="/admin" onClick={ () => setExpanded(false) }>ADMIN</Nav.Link> */}
                                <Nav.Link as={Link} to="/players" onClick={ () => setExpanded(false) }>PLAYERS</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            {/* <Container fluid className='header-panel'>
                <Row>
                    <Col className='header-icon'><DropdownIcon ></DropdownIcon></Col>
                    <Col className='header'> WATERLOO WARRIORS</Col>
                    <Col />
                </Row>
            </Container> */}
        </>
    )
}

export default Header;
