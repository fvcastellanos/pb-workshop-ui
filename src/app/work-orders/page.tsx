'use client'

import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { CommonRender } from "@/src/client/commons/CommonRender";
import Alert from "@/src/client/components/Alert";
import WorkOrderCrudModal from "@/src/client/components/modals/WorkOrderCrudModal";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { WorkOrderService } from "@/src/client/services/WorkOrderService";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import * as Icon from 'react-bootstrap-icons';

const WorkOrders = () => {

    const service = new WorkOrderService();

    const columns: GridColDef[] = [
        {
            field: 'id',
            width: 100,
            renderHeader: (params) => {
                return <strong>{'#'}</strong>
            },
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <button onClick={() => showEditModal(params.row.id)} style={{border: '0px', backgroundColor: 'transparent'}}>
                        <Icon.Pencil />
                    </button>            
                    <Link href={`/work-orders/${params.row.id}/details`}>
                        <Icon.Eye />
                    </Link>
                </>
            ),
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'number', 
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Número'}</strong>;
            }
        },
        {
            field: 'orderDate', 
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Fecha'}</strong>;
            }
        },
        { 
            field: 'plateNumber', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'No. Placa'}</strong>;
            }
        },
        { 
            field: 'contactName', 
            width: 250,
            renderHeader: (params) => {
                return <strong>{'Contacto'}</strong>;
            }
        },
        { 
            field: 'status', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Estado'}</strong>;
            },
            valueGetter: CommonRender.getWorkOrderStatus,
            align: 'center',
            headerAlign: 'center'
        },
    ];

    const [searchResult, setSearchResult] = useState(CommonCrud.buildDefaultSearchResponse());
    const [searchView, setSearchView] = useState(CommonCrud.buildSearchWithStatusView());
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [showModal, setShowModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);
    const [id, setId] = useState('');

    const textRef = useRef<HTMLInputElement | null>();
    const statusRef = useRef<HTMLSelectElement | null>();

    const [paginationModel, setPaginationModel] = useState({

        page: searchView.page,
        pageSize: searchView.size
    });

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
            status: statusRef.current.value
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
                        <h3>Ordenes de Trabajo</h3>
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
                                                <Form.Label>Estado</Form.Label>
                                                <Form.Select ref={statusRef}>
                                                    <option value={'%'}>Todos</option>
                                                    <option value={'P'}>En Proceso</option>
                                                    <option value={'A'}>Cancelada</option>
                                                    <option value={'C'}>Cerrada</option>
                                                    <option value={'D'}>Entregada</option>
                                                </Form.Select>
                                            </Col>
                                            <Col md={6}>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="secondary" onClick={performSearch}>Buscar</Button>
                                    &nbsp;
                                    <Button variant="primary" onClick={showAddModal}>Agregar Orden</Button>
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
                <WorkOrderCrudModal 
                    displayModal={showModal} 
                    handleCloseModal={closeModal} 
                    title={modifyModal? "Modificar Orden de Trabajo":"Agregar Orden de Trabajo" }
                    editModal={modifyModal}
                    editId={id}
                    onSaveChanges={() => performSearch()}
                />
            </Row>
        </Container>
    )
}

export default WorkOrders;
