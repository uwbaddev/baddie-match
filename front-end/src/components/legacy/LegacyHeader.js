import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import '../../index.css';

const LegacyHeader = () => {
    const [expanded, setExpanded] = useState(false);
    const closeMenu = () => setExpanded(false);

    return (
        <Navbar fixed="sticky" className="legacy-header-panel" expand={false}>
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="legacy-header" onClick={closeMenu}>
                    WATERLOO WARRIORS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={() => setExpanded(!expanded)} />
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="end"
                    show={expanded}
                >
                    <Offcanvas.Header closeButton onHide={closeMenu}>
                        <Offcanvas.Title id="offcanvasNavbarLabel">WARRIORS</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 legacy-page-header pe-3">
                            <Nav.Link as={Link} to="/" onClick={closeMenu}>HOME</Nav.Link>
                            <Nav.Link as={Link} to="/report" onClick={closeMenu}>REPORT MATCH</Nav.Link>
                            <Nav.Link as={Link} to="/results" onClick={closeMenu}>RESULTS</Nav.Link>
                            <Nav.Link as={Link} to="/elo" onClick={closeMenu}>ELO RANKINGS</Nav.Link>
                            <Nav.Link as={Link} to="/players" onClick={closeMenu}>PLAYERS</Nav.Link>
                            <Nav.Link as={Link} to="/v2" onClick={closeMenu}>TRY V2</Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};

export default LegacyHeader;
