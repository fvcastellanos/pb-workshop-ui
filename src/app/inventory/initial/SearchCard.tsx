import { useRef } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

export default function SearchCard({performSearch, showAddModal}) {

    const edInitialDate = useRef<HTMLInputElement | null>();
    const edFinalDate = useRef<HTMLInputElement | null>();
    const edText = useRef<HTMLInputElement | null>();

    const search = function () {

        const initialDate = edInitialDate.current? edInitialDate.current.value : null;
        const finalDate = edFinalDate.current? edFinalDate.current.value : null;

        performSearch(initialDate, finalDate);
    }

    return (

        <div className='top-separator'>
            <Card>
                <Card.Body>
                    <Card.Title>Búsqueda</Card.Title>
                    <Form>
                        <Row className="md-6">
                            <Col md={6}>
                                <Form.Label>Fecha Inicial</Form.Label>
                                <Form.Control type="date" ref={edInitialDate} />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Fecha Final</Form.Label>
                                <Form.Control type="date" ref={edFinalDate} />
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Button variant="secondary" onClick={search}>Buscar</Button>
                    &nbsp;
                    <Button variant="primary" onClick={showAddModal}>Agregar Tipo</Button>
                </Card.Footer>
            </Card>
        </div>       
    );
}
