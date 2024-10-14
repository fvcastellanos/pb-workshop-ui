'use client'

import { Button, Modal, Table } from "react-bootstrap";

export default function DeleteModal({
    showDeleteModal,
    hideDeleteModal,
    deleteDetail,
    deleteData
}) {

    return (
        <Modal show={showDeleteModal} onHide={hideDeleteModal} centered={true}>
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
                    <tr>
                        <th>Número de Orden</th>
                        <td>{deleteData.workOrderNumber}</td>
                    </tr>

                </Table>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={hideDeleteModal}>Cerrar</Button>
                <Button variant="danger" onClick={deleteDetail}>Eliminar</Button>
            </Modal.Footer>
        </Modal>
    );
}

