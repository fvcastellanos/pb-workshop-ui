import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Col, Form, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ContactService } from '../../services/ContactService';
import { ContactView } from '@/src/client/domain/ContactView';
import { ErrorView } from '@/src/client/domain/ErrorView';
import Alert from '../Alert';

const service = new ContactService();

const schema = yup.object({
    code: yup.string(),
    type: yup.string()
            .required('Tipo es requerido')
            .matches(/(PROVIDER|CUSTOMER)/, 'Los valores aceptados son: Proveedor o Cliente'),
    name: yup.string()
            .required('Nombre es requerido')
            .max(150, 'La longitud máxima es de 150 caracteres'),
    contact: yup.string()
            .nullable()
            .max(150, 'La longitud máxima es de 150 caracteres'),
    taxId: yup.string()
            .nullable()
            .max(50, 'La longitud máxima es de 50 caracteres'),
    description: yup.string()
            .nullable()
            .max(300, 'La longitud máxima es de 300 caracteres'),
    active: yup.string()
            .matches(/(ACTIVE|INACTIVE)/, 'Los valores aceptados son: Activo o Inactivo')
});

const CrudModal = ({editModal, editId, displayModal, handleCloseModal, onSaveChanges, title}) => {

    const form = useForm<ContactView>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = form;
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));

    const saveChanges = async (data: ContactView) => {

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

    const getById = async (id: string): Promise<ContactView> => {

        try {
            return await service.getById(id);

        } catch (failure) {

            throw failure;
        }
    }

    useEffect(() => {

        reset();
        setErrorView(new ErrorView(false, ''));

        if (editModal) {

            getById(editId)
                .then(view => {

                    setValue('code', view.code);
                    setValue('type', view.type);
                    setValue('name', view.name);
                    setValue('contact', view.contact);
                    setValue('taxId', view.taxId);
                    setValue('description', view.description ? view.description: '');
                    setValue('active', view.active);

                }).catch(setErrorView);
        }

    }, [displayModal]);


    const closeModal = () => {

        reset();
        handleCloseModal();
    }

    const handleOnHide = () => {

        closeModal();
    };

    const onSubmit = (data: ContactView) => { 

        setErrorView(new ErrorView(false, ''));
        saveChanges(data).then(() => {
            
            onSaveChanges();
            closeModal();

        }).catch(setErrorView);
    };

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
                                    defaultValue={'PROVIDER'}
                                    name="type"
                                    render={({ field }) => (
                                        <>
                                            <Form.Select {...field} {...register("type")}>
                                                <option value={'PROVIDER'}>Proveedor</option>
                                                <option value={'CUSTOMER'}>Cliente</option>
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
                                <Form.Label>Contacto</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="contact"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="text" placeholder="Contacto" {...field} {...register("contact")} isInvalid={!!errors.contact}  />
                                            {!!errors.contact && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.contact.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>NIT</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="taxId"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="text" placeholder="NIT" {...field} {...register("taxId")} isInvalid={!!errors.taxId}  />
                                            {!!errors.taxId && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.taxId.message}
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