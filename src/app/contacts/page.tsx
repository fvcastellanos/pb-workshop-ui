'use client'

import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { CommonRender } from "@/src/client/commons/CommonRender";
import Alert from "@/src/client/components/Alert";
import ContactCrudModal from "@/src/client/components/modals/ContactCrudModal";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { ContactService } from "@/src/client/services/ContactService";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import * as Icon from 'react-bootstrap-icons';

const Contacts = () => {

    const service = new ContactService();

    const columns: GridColDef[] = [
        {
            field: 'id',
            width: 150,
            renderHeader: (params) => {
                return <strong>{'#'}</strong>
            },
            renderCell: (params: GridRenderCellParams) => (
                <button onClick={() => showEditModal(params.row.id)} style={{border: '0px', backgroundColor: 'transparent'}}>
                    <Icon.Pencil />
                </button>            
            ),
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'code', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Código'}</strong>;
            }
        },
        { 
            field: 'name', 
            width: 250,
            renderHeader: (params) => {
                return <strong>{'Nombre'}</strong>;
            }
        },
        { 
            field: 'type', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Tipo'}</strong>;
            },
            valueGetter: CommonRender.getContactType,
            align: 'center',
            headerAlign: 'center'
        },
        { 
            field: 'active', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Activo'}</strong>;
            },
            valueGetter: CommonRender.getActiveValue,
            align: 'center',
            headerAlign: 'center'
        },
    ];

    const [searchResult, setSearchResult] = useState(CommonCrud.buildDefaultSearchResponse());
    const [searchView, setSearchView] = useState(CommonCrud.buildSearchWithTypeView());
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [showModal, setShowModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);
    const [id, setId] = useState('');

    const [paginationModel, setPaginationModel] = useState({

        page: searchView.page,
        pageSize: searchView.size
    });

    const textRef = useRef<HTMLInputElement | null>();
    const activeRef = useRef<HTMLSelectElement | null>();
    const typeRef = useRef<HTMLSelectElement | null>();

    const onPaginationModelChange = (event: any) => {

        setSearchView({
            ...searchView,
            page: event.page,
            size: event.pageSize
        });

        setPaginationModel(event);
    }

    const showAddModal = () => {

        setModifyModal(false);
        setShowModal(true);
    }

    const showEditModal = (id: string) => {

        setId(id);
        setModifyModal(true);
        setShowModal(true);
    }

    const closeModal = () => {

        setModifyModal(false);
        setShowModal(false);
    }

    const search = async () => {

        try {

            return await service.search(searchView);    

        } catch (exception) {

            throw exception;
        }
    }
        
    const performSearch = () => {

        setErrorView(new ErrorView(false, ''));

        setSearchView({
            ...searchView,
            text: textRef.current.value,
            type: typeRef.current.value,
            active: parseInt(activeRef.current.value)
        });
    }

    useEffect(() => {

        search().then(setSearchResult)
            .catch(setErrorView);

    }, [searchView]);

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className='top-separator'>
                        <h3>Contactos</h3>
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
                                            <Col>
                                                <Form.Label>Tipo</Form.Label>
                                                <Form.Select ref={typeRef}>
                                                    <option value={'%'}>Todos</option>
                                                    <option value={'P'}>Proveedor</option>
                                                    <option value={'C'}>Cliente</option>
                                                </Form.Select>
                                            </Col>
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
                                    <Button variant="secondary" onClick={performSearch}>Buscar</Button>
                                    &nbsp;
                                    <Button variant="primary" onClick={showAddModal}>Agregar Contacto</Button>
                                </Card.Footer>
                            </Card>
                        </div>
                        <div className='top-separator'>
                            <Alert variant='danger' show={errorView.show} message={errorView.message} />
                            <div style={{ height: 400, width: '100%' }}>
                                <div style={{ display: 'flex', height: '100%' }}>
                                    <div style={{ flexGrow: 1 }}>
                                        <DataGrid 
                                            columns={columns}
                                            disableColumnMenu
                                            rows={searchResult.content}
                                            rowCount={searchResult.pageable.totalElements}
                                            pagination
                                            paginationMode='server'
                                            pageSizeOptions={[ 10, 25, 50, 100, 500 ]}
                                            paginationModel={paginationModel}
                                            onPaginationModelChange={onPaginationModelChange}
                                            getRowClassName={(params) =>
                                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='top-separator'></div>

                     </div>
                </Col>
                <ContactCrudModal 
                    displayModal={showModal} 
                    handleCloseModal={closeModal} 
                    title={modifyModal? "Modificar Contacto":"Agregar Contacto" }
                    editModal={modifyModal}
                    editId={id}
                    onSaveChanges={() => performSearch()}
                />
            </Row>
        </Container>
    )
}

export default Contacts;