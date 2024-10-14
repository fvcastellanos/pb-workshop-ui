import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Col, Form, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { CarBrandService } from '@/src/client/services/CarBrandService';
import { CarBrandView } from '@/src/client/domain/CarBrandView';
import { ErrorView } from '@/src/client/domain/ErrorView';
import Alert from '../Alert';

const service = new CarBrandService();

const schema = yup.object({
    name: yup.string()
            .required('Nombre es requerido')
            .max(100, 'La longitud máxima es de 100 caracteres'),
    description: yup.string()
            .max(300, 'La longitud máxima es de 300 caracteres'),
    active: yup.string()
            .matches(/(ACTIVE|INACTIVE)/, 'Los valores aceptados son: Activo o Inactivo')
});

const CarBrandCrudModal = (props) => {

    const form = useForm<CarBrandView>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = form;
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));

    const saveChanges = async (data: CarBrandView) => {

        try {

            if (props.editModal) {
    
                await service.update(props.editId, data);
                return;
            }
    
            await service.add(data);
    
        } catch (failure) {

            throw failure;
        }
    };

    const getById = async (id: string): Promise<CarBrandView> => {

        try {
            return await service.getById(id);

        } catch (failure) {

            throw failure;
        }
    }

    useEffect(() => {

        reset();

        if (props.editModal) {

            getById(props.editId)
                .then(view => {

                    setValue('name', view.name);
                    setValue('description', view.description ? view.description: '');
                    setValue('active', view.active);

                }).catch(setErrorView);
        }

    }, [props.displayModal]);


    const closeModal = () => {

        reset();
        props.handleCloseModal();
    }

    const handleOnHide = () => {

        closeModal();
    };

    const onSubmit = (data: CarBrandView) => { 

        setErrorView(new ErrorView(false, ''));
        saveChanges(data).then(() => {
            
            props.onSaveChanges();
            closeModal();

        }).catch(setErrorView);
    };

    return (
        <Modal show={props.displayModal} onHide={handleOnHide}>
            <FormProvider {...form}>
                <Form onSubmit={handleSubmit(onSubmit)}>

                    <Modal.Header closeButton>
                        <Modal.Title>{props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Alert show={errorView.show} variant='danger' message={errorView.message} />
                            </Col>
                        </Row>
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
                        { props.editModal &&
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

export default CarBrandCrudModal;