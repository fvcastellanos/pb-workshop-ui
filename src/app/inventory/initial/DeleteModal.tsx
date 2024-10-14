'use client'

import { Button, Modal, Table } from "react-bootstrap";

export default function DeleteModal({
    displayModal,
    hideDeleteModal,
    deleteAction,
    deleteData
}) {

    return (
        <Modal show={displayModal} onHide={hideDeleteModal} centered={true}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Esta seguro de eliminar?</p>
                <Table striped bordered>
                    <tr>
                        <th>Fecha</th>
                        <td>{deleteData.operationDate}</td>
                    </tr>
                    <tr>
                        <th>Operation</th>
                        <td>{deleteData.operationType}</td>
                    </tr>
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
                        <th>Total</th>
                        <td>{deleteData.total}</td>
                    </tr>
                </Table>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={hideDeleteModal}>Cerrar</Button>
                <Button variant="danger" onClick={() => deleteAction(deleteData)}>Eliminar</Button>
            </Modal.Footer>
        </Modal>
    );
}

