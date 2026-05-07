import { Container, Row, Col } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";

const LegacyPlayers = () => {
    const { players } = useContext(AppContext);

    return (
        <main className="legacy-site">
            <Container>
                <Row>
                    <Col><p className="legacy-page-title">All Players</p></Col>
                </Row>
                {players.length === 0 ? (
                    <Col className="legacy-page-title">
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
        </main>
    );
};

export default LegacyPlayers;
