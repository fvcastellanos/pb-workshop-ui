'use client'

import Alert from "@/src/client/components/Alert";
import WorkOrderDetailModal from "@/src/client/components/modals/WorkOrderDetailModal";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { WorkOrderDetailView } from "@/src/client/domain/WorkOrderDetailView";
import { WorkOrderView } from "@/src/client/domain/WorkOrderView";
import { WorkOrderService } from "@/src/client/services/WorkOrderService";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";

import * as Icon from 'react-bootstrap-icons';

const WorkOrderDetails = () => {

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
                    <button onClick={() => confirmDeletion(params.row)} style={{border: '0px', backgroundColor: 'transparent'}}>
                        <Icon.Trash />
                    </button>            
                </>
            ),
            align: 'center',
            headerAlign: 'center'
        },
        { 
            field: 'quantity', 
            align: 'right',
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Cantidad'}</strong>;
            }
        },
        {
            field: 'productCode', 
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Código'}</strong>;
            }
        },
        {
            field: 'productName', 
            width: 300,
            renderHeader: (params) => {
                return <strong>{'Producto'}</strong>;
            }
        },
        { 
            field: 'unitPrice', 
            align: 'right',
            width: 125,
            renderHeader: (params) => {
                return <strong>{'Precio Unitario'}</strong>;
            }
        },
    ];  

    const params = useParams<{ id: string }>();
    const workOrderId = params.id;

    const [workOrderDetails, setWorkOrderDetails] = useState<WorkOrderDetailView[]>([]);
    const [workOrderView, setWorkOrderView] = useState<WorkOrderView>(new WorkOrderView());
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [showModal, setShowModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState({
        id: '',
        quantity: 0,
        productName: '',
        unitPrice: 0.00
    });

    const confirmDeletion = (row) => {

        setShowDeleteModal(true);
        setDeleteData({ 
            id: row.id,
            quantity: row.quantity, 
            productName: row.productName, 
            unitPrice: row.unitPrice
        });
    }

    const deleteDetail = () => {

        setShowDeleteModal(false);
        service.deleteDetail(workOrderId, deleteData.id)
            .then(() => reloadDetails())
            .catch(setErrorView);
    }

    const hideDeleteModal = () => {

        setShowDeleteModal(false);
    }

    const showAddModal = () => {

        setShowModal(true);
    }

    const closeModal = () => {

        setShowModal(false);
    }
      
    const getOdometerMeasurement = () => workOrderView.odometerMeasurement === 'K' ? 'Kms' : 'Millas';

    const getOrderStatus = () => {

        switch(workOrderView.status) {

            case 'IN_PROGRESS':
                return 'En Progreso';

            case 'CANCELLED':
                return 'Cancelada';

            case 'CLOSED':
                return 'Cerrada';

            case 'DELIVERED':
                return 'Entregada';

            default:
                return 'Desconocido';
        };
    }

    const getOrderDetail = async (): Promise<WorkOrderView> => {

        try {

            return await service.getById(workOrderId);

        } catch (failure) {

            throw new ErrorView(true, `No es posible obtener detalle de la Orden`);

        }
    }

    const reloadDetails = () => {

        setWorkOrderDetails([]);
    }

    useEffect(() => {

        getOrderDetail().then(setWorkOrderView)
            .catch(setErrorView);

    }, []);

    useEffect(() => {
        
        service.getDetails(workOrderId)
            .then(details => setWorkOrderDetails(details))
            .catch((failure) => setErrorView(new ErrorView(true, failure.message)));

    }, [workOrderDetails.length]);

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className='top-separator'>
                        <h3>Orden No. {workOrderView.number}</h3>
                        <div className='top-separator'>
                            <Card>
                                <Card.Body>
                                    <Card.Title></Card.Title>
                                    <Row>
                                        <Col md={2}><strong>Fecha</strong></Col>
                                        <Col md={4}>{workOrderView.orderDate}</Col>
                                        <Col md={2}><strong>No. Placa</strong></Col>
                                        <Col md={4}>{workOrderView.plateNumber}</Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}><strong>Cliente</strong></Col>
                                        <Col md={4}>{workOrderView.contactName}</Col>
                                        <Col md={2}><strong>Línea</strong></Col>
                                        <Col md={4}>{workOrderView.carLineName}</Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}><strong>Estado</strong></Col>
                                        <Col md={4}>{getOrderStatus()}</Col>
                                        <Col md={2}><strong>Combustible</strong></Col>
                                        <Col md={4}><Form.Range value={workOrderView.gasAmount} disabled max={1} min={0} step={0.25} /></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}><strong>Odómetro</strong></Col>
                                        <Col>{workOrderView.odometerValue} - {getOdometerMeasurement()}</Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}><strong>Notas</strong></Col>
                                        <Col>
                                            <Form.Control as="textarea" rows={3} readOnly value={workOrderView.notes} />
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer>
                                    <Link href={'/work-orders'} className='btn btn-secondary'>
                                        <Icon.ArrowLeft />
                                        &nbsp;
                                        Regresar
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" onClick={showAddModal}>Agregar Detalle</Button>
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
                                            rows={workOrderDetails}
                                            rowCount={workOrderDetails.length}
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
                <WorkOrderDetailModal
                    displayModal={showModal} 
                    handleCloseModal={closeModal} 
                    title={"Agregar Detalle"}
                    onSaveChanges={reloadDetails}
                    workOrderId={workOrderId} 
                />

                <Modal show={showDeleteModal} onHide={hideDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar eliminación</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Esta seguro de eliminar?</p>
                        <Table striped bordered>
                            <tr>
                                <th>Cantidad</th>
                                <td>{deleteData.quantity}</td>
                            </tr>
                            <tr>
                                <th>Producto</th>
                                <td>{deleteData.productName}</td>
                            </tr>
                            <tr>
                                <th>Precio Unitario</th>
                                <td>{deleteData.unitPrice}</td>
                            </tr>

                        </Table>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={hideDeleteModal}>Cerrar</Button>
                        <Button variant="danger" onClick={deleteDetail}>Eliminar</Button>
                    </Modal.Footer>
                </Modal>
            </Row>
        </Container>
    );
}

export default WorkOrderDetails;