import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Col, Form, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { CarLineService } from "@/src/client/services/CarLineService";
import { ContactService } from "@/src/client/services/ContactService";
import { WorkOrderService } from "@/src/client/services/WorkOrderService";
import { WorkOrderView } from '@/src/client/domain/WorkOrderView';
import { ErrorView } from '@/src/client/domain/ErrorView';
import { SearchView } from '@/src/client/domain/SearchView';
import { SearchWithTypeView } from '@/src/client/domain/SearchWithTypeView';
import Alert from '../Alert';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

const service = new WorkOrderService();
const carLineService = new CarLineService();
const contactService = new ContactService();

const schema = yup.object({
    number: yup.string()
            .required('Número es requerido')
            .max(100, 'La longitud máxima es de 100 caracteres'),
    status: yup.string()
            .required('Estado es requerido')
            .matches(/(IN_PROGRESS|CANCELLED|CLOSED|DELIVERED)/, 'Los valores aceptados son: En Proceso, Cancelada, Cerrada, Etregada'),
    odometerMeasurement: yup.string()
            .required('Tipo es requerido')
            .matches(/(K|M|)/, 'Los valores aceptados son: Kilómetros o Millas')
            .max(1, 'La longitud máxima es de 1 caracter'),
    odometerValue: yup.number()
            .required('El valor es requerido')
            .min(0),
    orderDate: yup.string()
                .required("Fecha es requerido"),
    gasAmount: yup.number()
            .min(0, 'El valor mínimo soportado es 0'),
    notes: yup.string()
            .max(1024, 'La longitud máxima es de 1024 caracteres'),
    plateNumber: yup.string()
            .required('El número de placa es requerido')
            .max(30, 'La longitud máxima es de 30 caracteres'),
    carLineId: yup.string()
            .required('Línea del vehículo es requerida')
            .max(50, 'La longitud máxima es de 50 caracteres'),
    contactId: yup.string()
            .required('Contacto es requerido')
            .max(50, 'La longitud máxima es de 50 caracteres')
});

const WorkOrderCrudModal = ({editModal, editId, displayModal, handleCloseModal, onSaveChanges, title}) => {

    const form = useForm<WorkOrderView>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = form;
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));

    const [carLines, setCarLines] = useState([]);
    const [carLineName, setCarLineName] = useState('');
    const [carLinesLoading, setCarLinesLoading] = useState(false);

    const [contacts, setContacts] = useState([]);
    const [contactName, setContactName] = useState('');
    const [contactsLoading, setContactsLoading] = useState(false);

    const saveChanges = async (data: WorkOrderView) => {

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

    const getById = async (id: string): Promise<WorkOrderView> => {

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

                    setValue('number', view.number);
                    setValue('status', view.status);
                    setValue('odometerMeasurement', view.odometerMeasurement);
                    setValue('odometerValue', view.odometerValue);
                    setValue('gasAmount', view.gasAmount);
                    setValue('notes', view.notes ? view.notes : '');
                    setValue('plateNumber', view.plateNumber);
                    setValue('orderDate', view.orderDate);
                    setValue('carLineId', view.carLineId);
                    setValue('carLineName', view.carLineName);
                    setValue('contactId', view.contactId);
                    setValue('contactName', view.contactName);
                    setValue('contactType', view.contactType);

                    setCarLineName(view.carLineName);
                    setContactName(view.contactName);
                                        
                }).catch(setErrorView);
        }

    }, [displayModal]);


    const closeModal = () => {

        reset();
        handleCloseModal();
        setCarLineName('');
        setCarLines([]);
        setContactName('');
        setContacts([]);
    }

    const handleOnHide = () => {

        closeModal();
    };

    const onSubmit = (data: WorkOrderView) => { 

        setErrorView(new ErrorView(false, ''));
        saveChanges(data).then(() => {
            
            onSaveChanges();
            closeModal();

        }).catch(setErrorView);
    };

    const searchCarLines = (query: string) => {

        setErrorView(new ErrorView(false, ''));

        const searchView: SearchView = {
            text: query,
            page: 0,
            size: 200,
            active: 1
        };

        setCarLinesLoading(true);
        carLineService.searchLines(searchView).then(response => {

            const lines = response.content.map(view => ({
                    id: view.id,
                    name: view.name
                }));

            setCarLines(lines);
            setCarLinesLoading(false);

        }).catch(error => {

            setCarLinesLoading(false);
            setErrorView(error)
        });

    }

    const onCarLineSelected = (selected) => {

        if (selected.length > 0) {

            const carLineId = selected[0].id;
            setValue('carLineId', carLineId);
            setCarLineName(selected[0].name);
            return;
        }

        setValue('carLineId', '');
        setCarLineName('');
    }

    const searchContact = (query: string) => {

        const search: SearchWithTypeView = {
            text: query,
            type: '%',
            page: 0,
            size: 200,
            active: 1
        };

        setContactsLoading(true);
            
        contactService.search(search).then(response => {

            const contacts = response.content.map(view => ({
                    id: view.id,
                    name: view.name
                }));

            setContacts(contacts);
            setContactsLoading(false);

        }).catch(error => {

            setContactsLoading(false);
            setErrorView(error)
        });
    }

    const onContactSelected = (selected) => {

        if (selected.length > 0) {

            const contactId = selected[0].id;
            setValue('contactId', contactId);
            setContactName(selected[0].name);
            return;
        }

        setValue('contactId', '');
        setContactName('');
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
                                <Form.Label>Número</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="number"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="text" placeholder="Número de orden" {...field} {...register("number")} isInvalid={!!errors.number}  />
                                            {!!errors.number && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.number.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Fecha</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="orderDate"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="date" placeholder="orderDate" {...field} {...register("orderDate")} isInvalid={!!errors.orderDate}   />
                                            {!!errors.orderDate && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.orderDate.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>No. Placa</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="plateNumber"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="text" placeholder="No. Placa" {...field} {...register("plateNumber")} isInvalid={!!errors.plateNumber}  />
                                            {!!errors.plateNumber && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.plateNumber.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Estado</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={'IN_PROGRESS'}
                                    name="status"
                                    render={({ field }) => (
                                        <>
                                            <Form.Select {...field} {...register("status")}>
                                                <option value={'IN_PROGRESS'}>En Progreso</option>
                                                <option value={'CANCELLED'}>Cancelada</option>
                                                <option value={'CLOSED'}>Cerrada</option>
                                                <option value={'DELIVERED'}>Entregada</option>
                                            </Form.Select>
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Medida Odómetro</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={'K'}
                                    name="odometerMeasurement"
                                    render={({ field }) => (
                                        <>  <br/>
                                            <Form.Check inline {...field} {...register("odometerMeasurement")} label="Kilómetros" value={'K'} type='radio'/>
                                            <Form.Check inline {...field} {...register("odometerMeasurement")} label="Millas" value={'M'} type='radio'/>
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Valor odómetro</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={0}
                                    name="odometerValue"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="number" placeholder="Valor odómetro" {...field} {...register("odometerValue")} isInvalid={!!errors.odometerValue}  />
                                            {!!errors.odometerValue && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.odometerValue.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Cantidad de Combustible</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={0}
                                    name="gasAmount"
                                    render={({ field }) => (
                                        <>
                                            <Form.Range {...field} {...register("gasAmount")} max={1} min={0} step={0.25} />
                                        </>
                                    )} />                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Línea de vehículo</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="carLineId"
                                    render={({ field }) => (
                                        <>
                                            <div className='typeahead-value'>{carLineName}</div>
                                            <AsyncTypeahead
                                                id='car-lines-search'
                                                filterBy={() => true}
                                                labelKey="name"
                                                minLength={2}
                                                isLoading={carLinesLoading}
                                                onSearch={searchCarLines}
                                                placeholder="Líneas de vehículos"
                                                options={carLines}
                                                isInvalid={!!errors.carLineId}
                                                clearButton={true}
                                                onChange={onCarLineSelected}
                                            />
                                            {!!errors.carLineId && 
                                                <div className='invalid-feedback' style={{display: 'block'}}>
                                                    {errors.carLineId.message}
                                                </div>
                                            }
                                            <Form.Control type='hidden' {...field} {...register("carLineId")} />
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
                                    name="contactId"
                                    render={({ field }) => (
                                        <>
                                            <div className='typeahead-value'>{contactName}</div>
                                            <AsyncTypeahead
                                                id='contacts-search'
                                                filterBy={() => true}
                                                labelKey="name"
                                                minLength={2}
                                                isLoading={contactsLoading}
                                                onSearch={searchContact}
                                                placeholder="Contactos"
                                                options={contacts}
                                                isInvalid={!!errors.contactId}
                                                clearButton={true}
                                                onChange={onContactSelected}
                                            />
                                            {!!errors.contactId && 
                                                <div className='invalid-feedback' style={{display: 'block'}}>
                                                    {errors.contactId.message}
                                                </div>
                                            }
                                            <Form.Control type='hidden' {...field} {...register("contactId")} />
                                        </>
                                    )} />                            

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Notas</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="notes"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control as="textarea" rows={3} {...field} {...register("notes")} isInvalid={!!errors.notes}  />
                                            {!!errors.notes && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.notes.message}
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

export default WorkOrderCrudModal;
