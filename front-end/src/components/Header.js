import { Col, Container, Nav, Navbar, Row, Offcanvas } from 'react-bootstrap'
import { DropdownIcon } from '../icons/MainDropdown.js';
import '../index.css'

const Header = () => {
    return (
        <>
            <Navbar fixed="sticky" className='header-panel' expand={false}>
                <Container fluid>
                    <Navbar.Brand href="/" className='header'>WATERLOO WARRIORS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar" />
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">WARRIORS</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 page-header pe-3">
                                <Nav.Link href="/">HOME</Nav.Link>
                                <Nav.Link href="/report">REPORT MATCH</Nav.Link>
                                <Nav.Link href="/results">RESULTS</Nav.Link>
                                <Nav.Link href="/players">PLAYERS</Nav.Link>
                                <Nav.Link href="/admin">ADMIN</Nav.Link>
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