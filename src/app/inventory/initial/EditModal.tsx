import Message from "@/src/client/components/Message";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { InventoryView } from "@/src/client/domain/InventoryView";
import { ProductView } from "@/src/client/domain/ProductView";
import { InventoryService } from "@/src/client/services/InventoryService";
import { Formik, setIn } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

import * as yup from 'yup';

const schema = yup.object({
    operationDate: yup.date()
        .typeError('Fecha inválida')
        .required('Fecha requerida'),
    product: yup.object()
        .typeError('Producto inválido')
        .required('Producto requerido'),
    quantity: yup.number()
        .min(1, 'La cantidad debe ser mayor o igual que 1')
        .required('Cantidad requerida'),
    unitPrice: yup.number()
        .min(0.01, 'El precio unitario debe ser mayor o igual que 0.01')
        .required('Precio unitario requerido'),
});

export default function EditModal({
    header, 
    displayModal, 
    isNew = true,
    closeAction, 
    onSaveAction = () => {},
    products = [],
    movement}) {

    const service = new InventoryService();

    const [errorView, setErrorView] = useState(ErrorView.buildEmptyErrorView());
    const [filteredProducts, setFilteredProducts] = useState<ProductView[]>([]);

    const onSubmit = (data: any) => { 

        setErrorView(ErrorView.buildEmptyErrorView());

        const initialMovement: InventoryView = {
            operationDate: data.operationDate,
            productCode: data.product.code,
            productName: data.product.name,
            quantity: data.quantity,
            unitPrice: data.unitPrice,            
        };

        if (isNew) {
            service.addInitialMovement(initialMovement)
                .then(() => {

                    closeAction();
                    onSaveAction();
                    
                }).catch(setErrorView);

            return;
        }

        // Set operation type
        initialMovement.operationType = movement.operationType;

        service.update(movement.id, initialMovement)
            .then(() => {
                    
                closeAction();
                onSaveAction();
                    
            }).catch(setErrorView);
    }

    useEffect(() => {

        if (displayModal) {

            setErrorView(ErrorView.buildEmptyErrorView());
            setFilteredProducts(products);    
        }

    }, [displayModal]);

    return (

        <Modal show={displayModal} onHide={closeAction} centered={true}>
            <Formik
                validationSchema={schema}
                onSubmit={onSubmit}
                initialValues={{
                    operationDate: null,
                    quantity: 0,
                    unitPrice: 0.00,
                    product: null
                }}
            >
                {
                    ({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => {

                        useEffect(() => {

                            if (!isNew) {

                                console.log({movement});

                                const product = {
                                    code: movement.productCode,
                                    name: movement.productName
                                };

                                setFieldValue('operationDate', movement.operationDate, false);
                                setFieldValue('quantity', movement.quantity, false);
                                setFieldValue('product', product, false);
                                setFieldValue('unitPrice', movement.unitPrice, false);
                            }

                        }, [displayModal]);

                        return (
                            <Form noValidate onSubmit={handleSubmit}>

                                <Modal.Header closeButton>
                                    <Modal.Title>{header}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            <Message show={errorView.show} 
                                                message={errorView.message} 
                                                variant="danger" 
                                                fieldErrors={errorView.fieldErrors} 
                                                details={errorView.details}
                                                dismissible={true}
                                                onDismiss={() => { setErrorView(ErrorView.buildEmptyErrorView()); }} 
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Fecha</Form.Label>
                                            <Form.Control
                                                name="operationDate"
                                                type="date"
                                                value={values.operationDate}
                                                onChange={handleChange}
                                                isValid={touched.operationDate && !errors.operationDate}
                                                isInvalid={errors.operationDate? true: false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.operationDate}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Cantidad</Form.Label>
                                            <Form.Control
                                                name="quantity" 
                                                type='text'
                                                value={values.quantity} 
                                                onChange={handleChange} 
                                                isValid={touched.quantity && !errors.quantity}
                                                isInvalid={errors.quantity? true : false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Producto</Form.Label>
                                            <Typeahead 
                                                clearButton
                                                id="product-search"
                                                inputProps={{
                                                    name: 'product',
                                                }}
                                                options={filteredProducts}
                                                placeholder="Seleccione un producto"
                                                onChange={(selected) => {
                                                    console.log({selected});
                                                    handleChange({
                                                        target: {
                                                            name: 'product', 
                                                            value: selected[0]
                                                        }
                                                    });
                                                }}
                                                labelKey={(option: ProductView) => `${option.code} - ${option.name}`}
                                                defaultInputValue={movement? `${movement.productCode} - ${movement.productName}`: ""}
                                                isValid={touched.product && !errors.product}
                                                isInvalid={errors.product? true: false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.product}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Precio Unitario</Form.Label>
                                            <Form.Control
                                                name="unitPrice" 
                                                type='number'
                                                value={values.unitPrice} 
                                                onChange={handleChange} 
                                                isValid={touched.unitPrice && !errors.unitPrice}
                                                isInvalid={errors.unitPrice? true : false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.unitPrice}</Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={closeAction}>
                                        Cerrar
                                    </Button>
                                    <Button variant="primary" type='submit'>
                                        Guardar Cambios
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        );
                    }
                }
            </Formik>
        </Modal>
    )
}
