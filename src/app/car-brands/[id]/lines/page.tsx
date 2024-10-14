'use client'

import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { CommonRender } from "@/src/client/commons/CommonRender";
import Alert from "@/src/client/components/Alert";
import CarLineCrudModal from "@/src/client/components/modals/CarLineCrudModal";
import { CarBrandView } from "@/src/client/domain/CarBrandView";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { CarBrandService } from "@/src/client/services/CarBrandService";
import { CarLineService } from "@/src/client/services/CarLineService";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';

const CarLines = () => {

    const service: CarLineService = new CarLineService();
    const carBrandService: CarBrandService = new CarBrandService();

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

    const params = useParams<{ id: string }>();
    const carBrandId: string = params.id;
    const [ carBrandView, setCarBrandView ] = useState(new CarBrandView());
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

            return await service.search(carBrandId, searchView);    

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

        carBrandService.getById(carBrandId)
            .then(setCarBrandView)
            .catch(setErrorView);
    }, []);

    useEffect(() => {

        search().then(setSearchResult)
            .catch(setErrorView);

    }, [searchView]);

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className='top-separator'>
                        <h3>Líneas de Vehículos</h3>
                        <div className='top-separator'>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Búsqueda</Card.Title>
                                    <Form>
                                        <Row className='md-6'>
                                            <Col md={8}>
                                                <h4>{carBrandView.name}</h4>
                                            </Col>
                                        </Row>
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
                                    <Link href={'/car-brands'} className='btn btn-secondary'>
                                        <Icon.ArrowLeft />
                                        &nbsp;
                                        Regresar
                                    </Link>
                                    &nbsp;
                                    <Button variant="secondary" onClick={performSearch}>Buscar</Button>
                                    &nbsp;
                                    <Button variant="primary" onClick={showAddModal}>Agregar Línea</Button>
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
                <CarLineCrudModal 
                    displayModal={showModal} 
                    handleCloseModal={closeModal} 
                    title={modifyModal? "Modificar Línea":"Agregar Línea" }
                    editModal={modifyModal}
                    carBrandId={carBrandId}
                    editId={id}
                    onSaveChanges={() => performSearch()}
                />
            </Row>
        </Container>
    )

}

export default CarLines;