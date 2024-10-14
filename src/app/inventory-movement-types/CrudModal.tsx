import { InventoryMovementTypeView } from '@/src/client/domain/InventoryMovementTypeView';
import { InventoryMovementTypeService } from '@/src/client/services/InventoryMovementTypeServices';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { Formik, useFormikContext } from 'formik';

import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { ErrorView } from '@/src/client/domain/ErrorView';
import Alert from '@/src/client/components/Alert';

const schema = yup.object({
    code: yup.string(),
    type: yup.string()
            .required('Tipo es requerido')
            .matches(/(INPUT|OUTPUT)/, 'Los valores aceptados son: Ingreso o Egreso'),
    name: yup.string()
            .required('Nombre es requerido')
            .max(150, 'La longitud máxima es de 150 caracteres'),
    description: yup.string()
            .nullable()
            .max(300, 'La longitud máxima es de 300 caracteres'),
    active: yup.string()
            .matches(/(ACTIVE|INACTIVE)/, 'Los valores aceptados son: Activo o Inactivo')
});

export default function CrudModal({editModal, editId, displayModal, handleCloseModal, onSaveChanges, title}) {

    const service: InventoryMovementTypeService = new InventoryMovementTypeService();

    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [inventoryMovementType, setInventoryMovementType] = useState(new InventoryMovementTypeView());

    const saveChanges = async (data: InventoryMovementTypeView) => {

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

    const closeModal = () => {

        handleCloseModal();
    }

    const handleOnHide = () => {

        closeModal();
    };

    const onSubmit = (data: InventoryMovementTypeView) => { 

        console.log('save changes was triggered');
        
        setErrorView(new ErrorView(false, ''));
        saveChanges(data).then(() => {
            
            onSaveChanges();
            closeModal();

        }).catch(setErrorView);
    };

    return (
        <Modal show={displayModal} onHide={handleOnHide}>
            <Formik
                validationSchema={schema}
                onSubmit={onSubmit}
                initialValues={{
                    ...inventoryMovementType,
                    active: 'ACTIVE'
                }}
            >
                {
                    ({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => {

                        useEffect(() => {

                            setErrorView(new ErrorView(false, ''));

                            if (editModal) {
                    
                                service.getById(editId)
                                    .then(view => {

                                        setInventoryMovementType(view);

                                        const fields = ['name', 'description', 'active', 'type', 'code'];

                                        fields.forEach(field => setFieldValue(field, view[field], false));
                                    })
                                    .catch(setErrorView);      
                                
                                return;
                            }
                                                
                            const view = new InventoryMovementTypeView();
                            setInventoryMovementType({
                                ...view,
                                active: 'ACTIVE',                            
                            });
                        }, [displayModal]);
                    

                        return (
                            <Form noValidate onSubmit={handleSubmit}>

                                <Modal.Header closeButton>
                                    <Modal.Title>{title}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            <Alert show={errorView.show} variant='danger' message={errorView.message} />
                                        </Col>                                
                                    </Row>
                                    {
                                        editModal &&
                                        <Row>
                                            <Col>
                                                <Form.Label>Código</Form.Label>
                                                <Form.Control
                                                    name="code" 
                                                    type='text'
                                                    value={values.code} 
                                                    onChange={handleChange} 
                                                    isValid={touched.code && !errors.code}
                                                    isInvalid={errors.code? true: false}
                                                    readOnly={true}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                            </Col>
                                        </Row>

                                    }
                                    <Row>
                                        <Col>
                                            <Form.Label>Tipo</Form.Label>
                                            <Form.Select 
                                                name="type" 
                                                value={values.type} 
                                                onChange={handleChange} 
                                                isValid={touched.type && !errors.type}
                                                isInvalid={errors.type? true: false}
                                            >
                                                <option value={''}>Seleccione...</option>
                                                <option value={'INPUT'}>Ingreso</option>
                                                <option value={'OUTPUT'}>Egreso</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                name="name" 
                                                type='text'
                                                value={values.name} 
                                                onChange={handleChange} 
                                                isValid={touched.name && !errors.name}
                                                isInvalid={errors.name? true: false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Descripción</Form.Label>
                                            <Form.Control
                                                name="description" 
                                                as="textarea"
                                                rows={3}
                                                value={values.description} 
                                                onChange={handleChange} 
                                                isValid={touched.description && !errors.description}
                                                isInvalid={errors.description? true: false}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    {
                                        editModal &&
                                        <Row>
                                            <Col>
                                                <Form.Label>Tipo</Form.Label>
                                                <Form.Select 
                                                    name="active" 
                                                    value={values.active} 
                                                    onChange={handleChange} 
                                                    isValid={touched.active && !errors.active}
                                                    isInvalid={errors.active? true: false}
                                                >
                                                    <option value={'ACTIVE'}>Activo</option>
                                                    <option value={'INACTIVE'}>Inactivo</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">{errors.active}</Form.Control.Feedback>
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
                        );
                    }
                }
            </Formik>
        </Modal>
    )
}