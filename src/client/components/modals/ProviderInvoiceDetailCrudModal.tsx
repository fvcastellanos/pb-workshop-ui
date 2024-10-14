import { ErrorView } from "@/src/client/domain/ErrorView";
import { SearchWithTypeView } from "@/src/client/domain/SearchWithTypeView";
import { ProductService } from "@/src/client/services/ProductService";

import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from 'yup';
import Alert from "../Alert";

import 'react-bootstrap-typeahead/css/Typeahead.css';
import { InvoiceService } from "@/src/client/services/InvoiceService";
import { InvoiceDetailView } from "@/src/client/domain/InvoiceDetailView";

const schema = yup.object({
    quantity: yup.number()
            .required('Cantidad es requerido')
            .min(1, 'La cantidad debe ser mayor o igual que 1'),
    unitPrice: yup.number()
            .required('Precio unitario es requerido')
            .min(0, 'El precio unitario debe ser mayor o igual que 0'),
    productCode: yup.string()
            .required('Código Producto es necesario')
            .max(50, 'La longitud máxima es de 50 caracteres'),
    workOrderNumber: yup.string()
            .required('Número de Orden es requerido')
            .max(100, 'La longitud máxima es de 100 caracteres'),
});


const ProviderInvoiceDetailCrudModal = ({
    title,
    invoiceId, 
    onSaveChanges, 
    handleCloseModal, 
    displayModal }) => {

        const service = new InvoiceService();
        const productService = new ProductService();
        
        const form = useForm<InvoiceDetailView>({
            resolver: yupResolver(schema),
            mode: 'onSubmit'
        });
    
        const { register, handleSubmit, control, formState: { errors }, reset, setValue } = form;
        const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    
        const [products, setProducts] = useState([]);
        const [productName, setProductName] = useState('');
        const [productsLoading, setProductsLoading] = useState(false);
    
        const saveChanges = async (data: InvoiceDetailView) => {
    
            try {
                await service.addDetail(invoiceId, data);
        
            } catch (failure) {
    
                throw failure;
            }
        };
    
        const closeModal = () => {
    
            reset();
            setProductName('');
            handleCloseModal();
        }
    
        const handleOnHide = () => {
    
            closeModal();
        };
    
        const onSubmit = (data: InvoiceDetailView) => { 
    
            setErrorView(new ErrorView(false, ''));
            saveChanges(data).then(() => {
                
                closeModal();
                onSaveChanges();
    
            }).catch(setErrorView);
        };
    
        const onProductSelected = (selected) => {
    
            if (selected.length > 0) {
    
                const code = selected[0].code;
                setValue('productCode', code);
                setProductName(selected[0].name);
    
                return;
            }
    
            setValue('productCode', '');
            setProductName('');
        }
    
        const searchProduct = (query: string) => {
    
            const search: SearchWithTypeView = {
    
                text: query,
                type: '%',
                page: 0,
                size: 200,
                active: 1
            }
    
            setProductsLoading(true);
    
            productService.search(search).then(response => {
    
                const products = response.content.map(view => ({
                    code: view.code,
                    name: view.name
                }));
    
                setProducts(products);
                setProductsLoading(false);
    
            }).catch(error => {
    
                setProductsLoading(false);
                setErrorView(error);
            });
        
        }
    
        return (
            <Modal show={displayModal} onHide={handleOnHide}>
                <FormProvider {...form}>
                    <Form onSubmit={handleSubmit(onSubmit)}>
    
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    <Alert show={errorView.show} variant='danger' message={errorView.message} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Cantidad</Form.Label>
                                    <Controller
                                        control={control}
                                        defaultValue={0}
                                        name="quantity"
                                        render={({ field }) => (
                                            <>
                                                <Form.Control type="number" placeholder="Cantidad" {...field} {...register("quantity")} isInvalid={!!errors.quantity}  />
                                                {!!errors.quantity && 
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.quantity.message}
                                                    </Form.Control.Feedback>
                                                }
                                            </>
                                        )} />                            
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Producto</Form.Label>
                                    <Controller
                                        control={control}
                                        defaultValue={''}
                                        name="productCode"
                                        render={({ field }) => (
                                            <>
                                                <div className='typeahead-value'>{productName}</div>
                                                <AsyncTypeahead
                                                    id='products-search'
                                                    filterBy={() => true}
                                                    labelKey="name"
                                                    minLength={2}
                                                    isLoading={productsLoading}
                                                    onSearch={searchProduct}
                                                    placeholder="Productos"
                                                    options={products}
                                                    isInvalid={!!errors.productCode}
                                                    clearButton={true}
                                                    onChange={onProductSelected}
                                                />
                                                {!!errors.productCode && 
                                                    <div className='invalid-feedback' style={{display: 'block'}}>
                                                        {errors.productCode.message}
                                                    </div>
                                                }
                                                <Form.Control type='hidden' {...field} {...register("productCode")} />
                                            </>
                                        )} />                            
    
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Precio Unitario</Form.Label>
                                    <Controller
                                        control={control}
                                        defaultValue={0.00}
                                        name="unitPrice"
                                        render={({ field }) => (
                                            <>
                                                <Form.Control type="number" placeholder="Precio Unitario" {...field} {...register("unitPrice")} isInvalid={!!errors.unitPrice}  />
                                                {!!errors.unitPrice && 
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.unitPrice.message}
                                                    </Form.Control.Feedback>
                                                }
                                            </>
                                        )} />                            
                                </Col>
                            </Row>
                            <Row>
                            <Col>
                                <Form.Label>Número de Orden</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="workOrderNumber"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="text" placeholder="Número de Orden" {...field} {...register("workOrderNumber")} isInvalid={!!errors.workOrderNumber}  />
                                            {!!errors.workOrderNumber && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.workOrderNumber.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeModal}>
                                Cerrar
                            </Button>
                            <Button variant="primary" type='submit'>
                                Guardar Cambios
                            </Button>
                        </Modal.Footer>
                    </Form>
                </FormProvider>
            </Modal>
        )        
}

export default ProviderInvoiceDetailCrudModal;