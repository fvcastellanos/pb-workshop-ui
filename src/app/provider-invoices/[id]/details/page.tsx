'use client'

import { ErrorView } from "@/src/client/domain/ErrorView";
import { InvoiceDetailView } from "@/src/client/domain/InvoiceDetailView";
import { InvoiceView } from "@/src/client/domain/InvoiceView";
import { InvoiceService } from "@/src/client/services/InvoiceService";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

import { ArrowLeft } from 'react-bootstrap-icons';
import DetailGrid from "./DetailGrid";
import { EditModal } from "./EditModal";
import DeleteModal from "./DeleteModal";

const ProviderInvoceDetail = () => {

    const invoiceService = new InvoiceService();

    const [invoiceView, setInvoiceView] = useState<InvoiceView>(new InvoiceView());
    const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetailView[]>([]);
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCrudModal, setShowCrudModal] = useState(false);
    const [deleteData, setDeleteData] = useState({
        id: '',
        quantity: 0,
        productName: '',
        unitPrice: 0.00,
        workOrderNumber: ''
    });

    const [isNew, setIsNew] = useState(true);

    const [detail, setDetail] = useState<InvoiceDetailView>(new InvoiceDetailView());

    const [totalInvoice, setTotalInvoice] = useState(0);

    const params = useParams<{ id: string }>();
    const invoiceId = params.id;

    const getInvoiceStatus = () => {

        switch (invoiceView.status) {

            case 'ACTIVE': return 'Activo';
            case 'CLOSED': return 'Anulada';
            case 'CANCELLED': return 'Cancelada';
            default: return 'Desconocido';
        }
    };

    const getInvoiceType = () => {

        switch (invoiceView.type) {

            case 'PROVIDER': return 'Proveedor';
            case 'CLIENT': return 'Cliente';
            default: return 'Desconocido';
        }
    }

    const getTotalInvoice = () => {

        const initialValue = 0;

        return invoiceDetails.map(detail => detail.quantity * detail.unitPrice)
            .reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);
    }

    const reloadDetails = () => {

        setInvoiceDetails([]);
    }

    const confirmDeletion = (row: InvoiceDetailView) => {

        setShowDeleteModal(true);
        setDeleteData({ 
            id: row.id,
            quantity: row.quantity, 
            productName: row.productName, 
            unitPrice: row.unitPrice,
            workOrderNumber: row.workOrderNumber
        });
    }

    const deleteDetail = () => {

        setShowDeleteModal(false);

        invoiceService.deleteDetail(invoiceId, deleteData.id)
            .then(() => reloadDetails())
            .catch(setErrorView);
    }

    const hideDeleteModal = () => {

        setShowDeleteModal(false);
    }

    const hideEditModal = () => {
        setShowCrudModal(false);
    }

    const editAction = (row: InvoiceDetailView) => {

        setShowCrudModal(true);
        setIsNew(false);
        setDetail(row);
    }

    const addAction = () => {
       
        setShowCrudModal(true);
        setIsNew(true);
        setDetail(new InvoiceDetailView());
    }
    
    const saveChanges = (data: InvoiceDetailView): void => {

        setShowCrudModal(false);
        
        saveChangesAsync(data).then(() => reloadDetails())
            .catch(setErrorView);
    }

    const saveChangesAsync = async (data: InvoiceDetailView): Promise<void> => {

        try {

            if (isNew) {

                await invoiceService.addDetail(invoiceId, data);
                return;
            }

            await invoiceService.updateDetail(invoiceId, data.id, data);
    
        } catch (failure) {

            throw failure;
        }
    }

    // Load invoice data at load
    useEffect(() => {

        invoiceService.getById(invoiceId)
            .then(setInvoiceView)
            .catch(setErrorView)
    }, []);

    useEffect(() => {

        invoiceService.getDetails(invoiceId)
            .then(details => {
                setInvoiceDetails(details);
                setTotalInvoice(getTotalInvoice);
            })
            .catch(setErrorView);

    }, [ invoiceDetails.length ]);

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className='top-separator'>
                        <h3>Proveedor - {invoiceView.contactName}</h3>
                        <div className='top-separator'>
                            <Card>
                                <Card.Body>
                                    <Card.Title></Card.Title>
                                    <Row>
                                        <Col md={2}><strong>Fecha</strong></Col>
                                        <Col md={4}>{invoiceView.invoiceDate}</Col>
                                        <Col md={2}><strong>Estado</strong></Col>
                                        <Col md={4}>{getInvoiceStatus()}</Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}><strong>Número</strong></Col>
                                        <Col md={4}>{invoiceView.suffix} - {invoiceView.number}</Col>
                                        <Col md={2}><strong>NIT</strong></Col>
                                        <Col md={4}>{invoiceView.contactTaxId}</Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}><strong>Vencimiento</strong></Col>
                                        <Col md={4}>{invoiceView.effectiveDate}</Col>
                                        <Col md={2}><strong>Tipo</strong></Col>
                                        <Col md={4}>{getInvoiceType()}</Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}></Col>
                                        <Col md={2}><strong>Total Factura</strong></Col>
                                        <Col md={4}>{totalInvoice}</Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer>
                                    <Link href={'/provider-invoices'} className='btn btn-secondary'>
                                        <ArrowLeft />
                                        &nbsp;
                                        Regresar
                                    </Link>
                                    &nbsp;
                                    <Button variant="primary" onClick={addAction}>Agregar Detalle</Button>                                    
                                </Card.Footer>
                            </Card>
                        </div>
                    </div>

                    <DetailGrid 
                        invoiceDetails={invoiceDetails} 
                        deleteAction={confirmDeletion}
                        editAction={editAction}
                    />

                    <DeleteModal 
                        showDeleteModal={showDeleteModal} 
                        hideDeleteModal={hideDeleteModal} 
                        deleteDetail={deleteDetail} 
                        deleteData={deleteData}
                    />

                    <EditModal 
                        showModal={showCrudModal} 
                        hideModal={hideEditModal}
                        detail={detail}
                        saveChanges={saveChanges}
                        editModal={!isNew}
                    />
                </Col>
            </Row>
        </Container>        
    );
}

export default ProviderInvoceDetail;
