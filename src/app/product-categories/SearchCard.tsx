import { useRef } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const SearchCard = ({performSearch, showAddModal}) => {

    const textRef = useRef<HTMLInputElement | null>();
    const activeRef = useRef<HTMLSelectElement | null>();

    const onSearch = (event) => {

        const active = parseInt(activeRef.current.value);
        performSearch(textRef.current.value, active);
    }

    return (
        <div className='top-separator'>
            <Card>
                <Card.Body>
                    <Card.Title>Búsqueda</Card.Title>
                    <Form>
                        <Row className='md-6'>
                            <Col md={12}>
                                <Form.Label>Texto</Form.Label>
                                <Form.Control type="text" placeholder="Texto" ref={textRef} />
                            </Col>
                        </Row>
                        <Row className='md-6'>
                            <Col md={6}>
                                <Form.Label>Activo</Form.Label>
                                <Form.Select ref={activeRef}>
                                    <option value={1}>Si</option>
                                    <option value={0}>No</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Button variant="secondary" onClick={onSearch}>Buscar</Button>
                    &nbsp;
                    <Button variant="primary" onClick={showAddModal}>Agregar Categoría</Button>
                </Card.Footer>
            </Card>
        </div>
    )
}

export default SearchCard;