import Alert from "@/src/client/components/Alert";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { InvoiceDetailView } from "@/src/client/domain/InvoiceDetailView";
import { ProductView } from "@/src/client/domain/ProductView";
import { SearchWithTypeView } from "@/src/client/domain/SearchWithTypeView";
import { ProductService } from "@/src/client/services/ProductService";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

import * as yup from 'yup';

const schema = yup.object({
    quantity: yup.number()
            .typeError('El valor debe ser numérico')
            .required('Cantidad es requerido')
            .min(1, 'La cantidad debe ser mayor o igual que 1'),
    unitPrice: yup.number()
            .typeError('El valor debe ser numérico')
            .required('Precio unitario es requerido')
            .min(0, 'El precio unitario debe ser mayor o igual que 0'),
    productCode: yup.string()
            .required('Código Producto es necesario')
            .max(50, 'La longitud máxima es de 50 caracteres'),
    discountPercentage: yup.number()
            .min(0, 'El descuento debe ser mayor o igual que 0')
            .max(100, 'El descuento debe ser menor o igual que 100'),
    workOrderNumber: yup.string()
            .notRequired()
            .max(100, 'La longitud máxima es de 100 caracteres'),                
});    

export function EditModal({
        showModal, 
        hideModal,
        detail, 
        editModal=false,
        saveChanges,
    }) {

    const [errorView, setErrorView] = useState(new ErrorView(false, ''));

    // Product typeahead

    const productService = new ProductService();
    const [products, setProducts] = useState([]);
    const [productSelected, setProductSelected] = useState<ProductView>(new ProductView());

    const [productsLoading, setProductsLoading] = useState(false);

    const searchProduct = (query: string) => {
       
        const search: SearchWithTypeView = {

            text: query,
            type: '%',
            page: 0,
            size: 200,
            category: '%',
            active: 1
        }

        setProductsLoading(true);

        productService.search(search).then(response => {

            const products = response.content.map(view => ({
                id: view.code,
                label: view.name
            }));

            setProducts(products);
            setProductsLoading(false);

        }).catch(error => {

            setErrorView(error);
            setProductsLoading(false);
        });   
    }

    const buildSelectedProduct = (selected: any) => {

        const product = new ProductView();
        product.code = selected.id;
        product.name = selected.label;

        return product;
    }

    // End Product typeahead

    const onSubmit = (values: InvoiceDetailView) => {
        saveChanges(values)
    }

    return (
        <Modal show={showModal} onHide={hideModal} centered={true}>
            <Formik
                validationSchema={schema}
                onSubmit={onSubmit}
                initialValues={detail}
            >
                {
                    ({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => {

                        useEffect(() => {

                            setErrorView(new ErrorView(false, ''));
                            setProductSelected(buildSelectedProduct(detail));

                            if (editModal) {

                                setFieldValue('productCode', detail.productCode);
                            }
                        }, [showModal]);

                        return (
                            <Form noValidate onSubmit={handleSubmit}>

                                <Modal.Header closeButton>
                                    <Modal.Title>{ editModal? "Modificar Detalle" : "Agregar Detalle" }</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            <Alert show={errorView.show} variant='danger' message={errorView.message} />
                                        </Col>                                
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Label>Cantidad</Form.Label>
                                            <Form.Control
                                                name="quantity" 
                                                type='text'
                                                value={values.quantity} 
                                                onChange={handleChange} 
                                                isValid={touched.quantity && !errors.quantity}
                                                isInvalid={errors.quantity? true: false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>Producto / Servicios</Form.Label>
                                            <Form.Control
                                                name="productCode" 
                                                type='hidden'
                                                value={values.productCode} 
                                                onChange={handleChange} 
                                                isValid={touched.productCode && !errors.productCode}
                                                isInvalid={errors.productCode? true: false}
                                            />
                                            <AsyncTypeahead
                                                id='products-search'
                                                filterBy={() => true}
                                                labelKey="label"
                                                minLength={2}
                                                isLoading={productsLoading}
                                                onSearch={searchProduct}
                                                placeholder="Productos / Servicios"
                                                options={products}
                                                isValid={touched.productCode && !errors.productCode}
                                                isInvalid={errors.productCode? true: false}
                                                clearButton={false}
                                                onChange={(selected) => {

                                                    if (selected.length > 0) {                                               
                                                        const product: any = selected[0];
                                                        setFieldValue('productCode', product.id);
                                                        setProductSelected(buildSelectedProduct(product));
                                                    }
                                                }}
                                            />
                                            <div className='typeahead-value'>{detail.productName}</div>

                                            <Form.Control.Feedback type="invalid">{errors.productCode}</Form.Control.Feedback>
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
                                                isInvalid={errors.unitPrice? true: false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.unitPrice}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>% Descuento</Form.Label>
                                            <Form.Control
                                                name="discountPercentage" 
                                                type='number'
                                                value={values.discountPercentage} 
                                                onChange={handleChange} 
                                                isValid={touched.discountPercentage && !errors.discountPercentage}
                                                isInvalid={errors.discountPercentage? true: false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.discountPercentage}</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label># Orden</Form.Label>
                                            <Form.Control
                                                name="workOrderNumber" 
                                                type='text'
                                                value={values.workOrderNumber} 
                                                onChange={handleChange} 
                                                isValid={touched.workOrderNumber && !errors.workOrderNumber}
                                                isInvalid={errors.workOrderNumber? true: false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.workOrderNumber}</Form.Control.Feedback>
                                        </Col>
                                    </Row>

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={hideModal}>
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
    );
}