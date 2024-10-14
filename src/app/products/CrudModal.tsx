import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Col, Form, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ProductService } from '@/src/client/services/ProductService';
import { ProductView } from '@/src/client/domain/ProductView';
import { ErrorView } from '@/src/client/domain/ErrorView';
import Alert from '@/src/client/components/Alert';
import { ProductCategoryService } from '@/src/client/services/ProductCategoryService';
import { CommonCrud } from '@/src/client/commons/CommonCrud';

const schema = yup.object({
    code: yup.string(),
    type: yup.string()
            .required('Tipo es requerido')
            .matches(/(PRODUCT|SERVICE)/, 'Los valores aceptados son: Producto o Servicio'),
    categoryId: yup.string()
            .required('Categoría es requerido'),
    categoryName: yup.string(),
    name: yup.string()
            .required('Nombre es requerido')
            .max(150, 'La longitud máxima es de 150 caracteres'),
    contact: yup.string()
            .nullable()
            .max(150, 'La longitud máxima es de 150 caracteres'),
    description: yup.string()
            .nullable()
            .max(300, 'La longitud máxima es de 300 caracteres'),
    minimalQuantity: yup.number()
            .required('Cantidad mínima es requerida')
            .positive('La cantiad debe ser mayor que 0'),
    active: yup.string()
            .matches(/(ACTIVE|INACTIVE)/, 'Los valores aceptados son: Activo o Inactivo')
});

const CrudModal = ({editModal, editId, displayModal, handleCloseModal, onSaveChanges, title}) => {

    const service = new ProductService();
    const categoryService = new ProductCategoryService();

    const form = useForm<ProductView>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = form;
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [categories, setCategories] = useState([]);

    const saveChanges = async (data: ProductView) => {

        try {
            if (editModal) {
    
                await service.update(editId, data);
                return;
            }
    
            await service.add(data);
    
        } catch (failure) {

            throw failure;
        }
    };

    const getById = async (id: string): Promise<ProductView> => {

        try {
            return await service.getById(id);

        } catch (failure) {

            throw failure;
        }
    }

    const closeModal = () => {

        reset();
        handleCloseModal();
    }

    const handleOnHide = () => {

        closeModal();
    };

    const onSubmit = (data: ProductView) => { 

        setErrorView(new ErrorView(false, ''));
        saveChanges(data).then(() => {
            
            onSaveChanges();
            closeModal();

        }).catch(setErrorView);
    };

    useEffect(() => {

        reset();
        setErrorView(new ErrorView(false, ''));

        if (editModal) {

            getById(editId)
                .then(view => {

                    setValue('code', view.code);
                    setValue('type', view.type);
                    setValue('categoryId', view.categoryId ? view.categoryId : '');
                    setValue('categoryName', view.categoryName? view.categoryName: '');
                    setValue('name', view.name);
                    setValue('minimalQuantity', view.minimalQuantity)
                    setValue('description', view.description ? view.description: '');
                    setValue('active', view.active);

                }).catch(setErrorView);
        }

    }, [displayModal]);

    useEffect(() => {

        const categorySearch = CommonCrud.buildDefaultSearchView();
        categorySearch.size = 50;

        categoryService.search(categorySearch)
            .then(response => {

                setCategories(response.content);
            }).catch(setErrorView);

    }, [])

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
                                <Form.Label>Tipo</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={'PRODUCT'}
                                    name="type"
                                    render={({ field }) => (
                                        <>
                                            <Form.Select {...field} {...register("type")}>
                                                <option value={'PRODUCT'}>Producto</option>
                                                <option value={'SERVICE'}>Servicio</option>
                                            </Form.Select>
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Categoría</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <>
                                            <Form.Select {...field} {...register("categoryId")}>
                                                <option value={''}>Seleccione</option>
                                                {
                                                    categories.map(category => {

                                                        return (
                                                            <option key={'key' + category.id } value={category.id}>{category.name}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        {
                            editModal &&
                            <Row>
                                <Col>
                                    <Form.Label>Código</Form.Label>
                                    <Controller
                                        control={control}
                                        defaultValue={''}
                                        name="code"
                                        render={({ field }) => (
                                            <>
                                                <Form.Control type="text" placeholder="Código" {...field} {...register("code")} isInvalid={!!errors.code} readOnly={true}  />
                                                {!!errors.code && 
                                                    <Form.Control.Feedback type='invalid'>
                                                        {errors.code.message}
                                                    </Form.Control.Feedback>
                                                }
                                            </>
                                        )} />                            
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col>
                                <Form.Label>Nombre</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="name"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="text" placeholder="Nombre" {...field} {...register("name")} isInvalid={!!errors.name}  />
                                            {!!errors.name && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.name.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Descripción</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="description"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control as="textarea" rows={3} {...field} {...register("description")} isInvalid={!!errors.description}  />
                                            {!!errors.description && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.description.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Cantidad Mínima</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={1}
                                    name="minimalQuantity"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="number" placeholder="Cantidad mínima" {...field} {...register("minimalQuantity")} isInvalid={!!errors.minimalQuantity}  />
                                            {!!errors.minimalQuantity && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.minimalQuantity.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        { editModal &&
                            <Row>
                                <Col>
                                    <Form.Label>Activo</Form.Label>
                                    <Controller
                                        control={control}
                                        defaultValue={'ACTIVE'}
                                        name="active"
                                        render={({ field }) => (
                                            <>
                                                <Form.Select {...field} {...register("active")}>
                                                    <option value={'ACTIVE'}>Activo</option>
                                                    <option value={'INACTIVE'}>Inactivo</option>
                                                </Form.Select>
                                            </>
                                        )} />                            
                                </Col>
                            </Row>
                        }
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

export default CrudModal;
