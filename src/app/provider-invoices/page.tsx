'use client'

import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { CommonRender } from "@/src/client/commons/CommonRender";
import Alert from "@/src/client/components/Alert";
import ProviderInvoiceCrudModal from "@/src/client/components/modals/ProviderInvoiceCrudModal";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { InvoiceService } from "@/src/client/services/InvoiceService";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import * as Icon from 'react-bootstrap-icons';

const ProviderInvoices = () => {

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
                    <Link href={`/provider-invoices/${params.row.id}/details`}>
                        <Icon.Eye />
                    </Link>
                </>
            
            ),
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'invoiceDate', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Fecha'}</strong>;
            },
            align: 'center',
            headerAlign: 'center'

        },
        { 
            field: 'number', 
            width: 250,
            renderHeader: (params) => {
                return <strong>{'Número'}</strong>;
            },
            align: 'left',
            headerAlign: 'center'
        },
        { 
            field: 'contactTaxId', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'NIT'}</strong>;
            },
            align: 'left',
            headerAlign: 'left'
        },
        { 
            field: 'contactName', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Contacto'}</strong>;
            },
            align: 'left',
            headerAlign: 'left'
        },
        { 
            field: 'status', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Estado'}</strong>;
            },
            valueGetter: CommonRender.getInvoiceStatus,
            align: 'center',
            headerAlign: 'center'
        },
    ];

    const service = new InvoiceService();

    const [searchResult, setSearchResult] = useState(CommonCrud.buildDefaultSearchResponse());
    const [searchView, setSearchView] = useState(CommonCrud.buildSearchWithStatusAndTypeView());
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [showModal, setShowModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);
    const [id, setId] = useState('');

    const [paginationModel, setPaginationModel] = useState({

        page: searchView.page,
        pageSize: searchView.size
    });

    const textRef = useRef<HTMLInputElement | null>();
    const statusRef = useRef<HTMLSelectElement | null>();

    const onPaginationModelChange = (event: any) => {

        setSearchView({
            ...searchView,
            page: event.page,
            size: event.pageSize
        });

        setPaginationModel(event);
    }

    const setRowsPerPage = (newPageSize: number) => {

        setSearchView({
            ...searchView,
            size: newPageSize
        })
    }

    const setPage = (newPage: number) => {

        setSearchView({
            ...searchView,
            page: newPage
        })
    }

    const showEditModal = (id: string) => {

        setId(id);
        setModifyModal(true);
        setShowModal(true);
    }

    const showAddModal = () => {

        setModifyModal(false);
        setShowModal(true);
    }

    const closeModal = () => {

        setModifyModal(false);
        setShowModal(false);
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

        service.search(searchView)
            .then(setSearchResult)
            .catch(setErrorView);

    }, [searchView]);

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className='top-separator'>
                        <h3>Facturas de Proveedores</h3>
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
                                            <Col md={4}>
                                                <Form.Label>Estado</Form.Label>
                                                <Form.Select ref={statusRef}>
                                                    <option value={'A'}>Activa</option>
                                                    <option value={'C'}>Anulada</option>
                                                    <option value={'D'}>Cancelada</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="secondary" onClick={performSearch}>Buscar</Button>
                                    &nbsp;
                                    <Button variant="primary" onClick={showAddModal}>Agregar Factura</Button>
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
                <ProviderInvoiceCrudModal 
                    displayModal={showModal} 
                    handleCloseModal={closeModal} 
                    title={modifyModal? "Modificar Factura":"Agregar Factura" }
                    editModal={modifyModal}
                    editId={id}
                    onSaveChanges={() => performSearch()}
                />

            </Row>
        </Container>
    )
}

export default ProviderInvoices;
