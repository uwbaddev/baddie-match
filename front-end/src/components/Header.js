import { Col, Container, Row } from 'react-bootstrap'
import { DropdownIcon } from '../icons/MainDropdown.js';
import '../index.css'

const Header = () => {
    return (
        <>
            <Container className='header-panel'>
                <Row>
                    <Col className='header-icon'><DropdownIcon></DropdownIcon></Col>
                    <Col className='header'> WATERLOO WARRIORS</Col>
                </Row>
            </Container>
        </>
    )
}

export default Header;