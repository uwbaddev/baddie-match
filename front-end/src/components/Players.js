import { Container, Row, Col } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";

const Players = () => {
    const { players } = useContext(AppContext);

    return (
        <>
            <Container>
                <Row>
                    <Col><p className="page-title">All Players</p></Col>
                </Row>
                {players.length === 0 ? (
                    <Col className="page-title">
                        Retreiving data, please be patient...
                    </Col>
                ) : (
                    <>
                        {players.map(p => (
                            <Row key={p.id}>
                                {p.first_name} {p.last_name}
                            </Row>
                        ))}
                    </>
                )}
            </Container>
        </>
    );
};

export default Players;
