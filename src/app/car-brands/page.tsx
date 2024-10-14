'use client'

import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { CommonRender } from "@/src/client/commons/CommonRender";
import Alert from "@/src/client/components/Alert";
import CarBrandCrudModal from "@/src/client/components/modals/CarBrandCrudModal";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { CarBrandService } from "@/src/client/services/CarBrandService";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';

const service = new CarBrandService();

const CarBrands = () => {

    const columns: GridColDef[] = [
        {
            field: 'id',
            width: 150,
            renderHeader: (params) => {
                return <strong>{'#'}</strong>
            },
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <button onClick={() => showEditModal(params.row.id)} style={{border: '0px', backgroundColor: 'transparent'}}>
                        <Icon.Pencil />
                    </button>            
                    <Link href={`/car-brands/${params.row.id}/lines`}>
                        <Icon.Tools />
                    </Link>
                </>
        ),
            align: 'center',
            headerAlign: 'center'
        },
        { 
            field: 'name', 
            width: 450,
            renderHeader: (params) => {
                return <strong>{'Nombre'}</strong>;
            }
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
    const [searchView, setSearchView] = useState(CommonCrud.buildDefaultSearchView());
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [showModal, setShowModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);
    const [id, setId] = useState('');

    const [paginationModel, setPaginationModel] = useState({

        page: searchView.page,
        pageSize: searchView.size
    });

    const nameRef = useRef<HTMLInputElement | null>();
    const activeRef = useRef<HTMLSelectElement | null>();

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
            text: nameRef.current.value,
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
                        <h3>Marcas de Vehículos</h3>
                        <div className='top-separator'>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Búsqueda</Card.Title>
                                    <Form>
                                        <Row className='md-6'>
                                            <Col md={8}>
                                                <Form.Label>Nombre</Form.Label>
                                                <Form.Control type="text" placeholder="Nombre" ref={nameRef} />
                                            </Col>
                                            <Col>
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
                                    <Button variant="primary" onClick={showAddModal}>Agregar Fabricante</Button>
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
                <CarBrandCrudModal 
                    displayModal={showModal} 
                    handleCloseModal={closeModal} 
                    title={modifyModal? "Modificar Fabricante":"Agregar Fabricante" }
                    editModal={modifyModal}
                    editId={id}
                    onSaveChanges={() => performSearch()}
                />
            </Row>
        </Container>
    )
}

export default CarBrands;