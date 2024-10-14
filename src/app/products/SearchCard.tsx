import { CommonCrud } from "@/src/client/commons/CommonCrud";
import Alert from "@/src/client/components/Alert";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { ProductCategoryService } from "@/src/client/services/ProductCategoryService";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const SearchCard = ({performSearch, showAddModal}) => {

    const service: ProductCategoryService = new ProductCategoryService();

    const textRef = useRef<HTMLInputElement | null>();
    const activeRef = useRef<HTMLSelectElement | null>();
    const typeRef = useRef<HTMLSelectElement | null>();
    const categoryRef = useRef<HTMLSelectElement | null>();

    const [categories, setCategories] = useState([]);
    const [errorView, setErrorView] = useState(new ErrorView(false, ""));

    const onSearch = () => {
     
        const text = textRef.current.value;
        const type = typeRef.current.value;
        const category = categoryRef.current.value;
        const active = parseInt(activeRef.current.value);
    
        performSearch(text, type, category, active);
    }

    useEffect(() => {

        if (categories.length === 0) {

            service.search(CommonCrud.buildDefaultSearchView())
                .then(response => {

                    setCategories(response.content);
                }).catch(setErrorView);
        }

    }, []);

    return (

        <div className='top-separator'>
            <Card>
                <Card.Body>
                    <Card.Title>Búsqueda</Card.Title>
                    <Alert show={errorView.show} message={errorView.message} variant={'danger'} />
                    <Form>
                        <Row className='md-6'>
                            <Col md={12}>
                                <Form.Label>Texto</Form.Label>
                                <Form.Control type="text" placeholder="Texto" ref={textRef} />
                            </Col>
                        </Row>
                        <Row className='md-6'>
                            <Col>
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select ref={typeRef}>
                                    <option value={'%'}>Todos</option>
                                    <option value={'P'}>Producto</option>
                                    <option value={'S'}>Servicio</option>
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label>Categoría</Form.Label>
                                    <Form.Select ref={categoryRef}>
                                        <option value={'%'}>Todas</option>
                                        {
                                            categories.map(category => {
                                                return (
                                                    <option key={'key' + category.id } value={category.id}>{category.name}</option>
                                                );
                                            })
                                        }
                                    </Form.Select>
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
                    <Button variant="primary" onClick={showAddModal}>Agregar Producto</Button>
                </Card.Footer>
            </Card>
        </div>

    );

}

export default SearchCard;