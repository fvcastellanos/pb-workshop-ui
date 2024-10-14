import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Col, Form, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ErrorView } from '@/src/client/domain/ErrorView';
import Alert from '../Alert';
import { InvoiceView } from '@/src/client/domain/InvoiceView';
import { InvoiceService } from '@/src/client/services/InvoiceService';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { SearchWithTypeView } from '@/src/client/domain/SearchWithTypeView';
import { ContactService } from '@/src/client/services/ContactService';

const schema = yup.object({
    suffix: yup.string()
            .required('Sufijo es requerido')
            .max(30, 'La longitud máxima es de 30 caracteres'),
    number: yup.string()
            .required('Número es requerido')
            .max(100, 'La longitud máxima es de 100 caracteres'),
    imageUrl: yup.string()
            .nullable()
            .max(250, 'La longitud máxima es de 250 caracteres'),
    contactId: yup.string()
            .required('El contacto es requerido')
            .max(150, 'La longitud máxima es de 150 caracteres'),
    invoiceDate: yup.string()
            .required("La fecha de la factura es requerida"),
    status: yup.string()
            .matches(/(ACTIVE|CLOSED|CANCELLED)/, 'Los valores aceptados son: Activo, Cancelada o Anulada')
});

const ProviderInvoiceCrudModal = ({
        editModal, 
        editId, 
        displayModal, 
        handleCloseModal, 
        onSaveChanges, 
        title
    }) => {

    const service = new InvoiceService();
    const contactService = new ContactService();

    const form = useForm<InvoiceView>({
        resolver: yupResolver(schema),
        defaultValues: {
            type: 'PROVIDER'
        },
        mode: 'onSubmit'
    });

    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = form;
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));

    const [contacts, setContacts] = useState([]);
    const [contactName, setContactName] = useState('');
    const [contactsLoading, setContactsLoading] = useState(false);


    const saveChanges = async (data: InvoiceView) => {

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

    const getById = async (id: string): Promise<InvoiceView> => {

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

                    setValue('type', view.type);
                    setValue('suffix', view.suffix);
                    setValue('number', view.number);
                    setValue('invoiceDate', view.invoiceDate)
                    setValue('imageUrl', view.imageUrl ? view.imageUrl: '');
                    setValue('status', view.status);
                    setValue('contactId', view.contactId);
                    setValue('contactName', view.contactName);
                    setValue('contactTaxId', view.contactTaxId);
                    setValue('contactType', view.contactType);

                    setContactName(view.contactName);
                }).catch(setErrorView);
        }

    }, [displayModal]);


    const closeModal = () => {

        reset();
        handleCloseModal();
        setContactName('');
        setContacts([]);
    }

    const handleOnHide = () => {

        closeModal();
    };

    const onSubmit = (data: InvoiceView) => { 

        setErrorView(new ErrorView(false, ''));
        saveChanges(data).then(() => {
            
            onSaveChanges();
            closeModal();

        }).catch(setErrorView);
    };

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
                                <Form.Label>Proveedor</Form.Label>
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
                                                placeholder="Proveedores"
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
                                <Form.Label>Serie</Form.Label>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name="suffix"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="text" placeholder="Serie" {...field} {...register("suffix")} isInvalid={!!errors.suffix}  />
                                            {!!errors.suffix && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.suffix.message}
                                                </Form.Control.Feedback>
                                            }
                                        </>
                                    )} />                            
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
                                            <Form.Control type="text" placeholder="Número" {...field} {...register("number")} isInvalid={!!errors.number}  />
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
                                    name="invoiceDate"
                                    render={({ field }) => (
                                        <>
                                            <Form.Control type="date" placeholder="invoiceDate" {...field} {...register("invoiceDate")} isInvalid={!!errors.invoiceDate}   />
                                            {!!errors.invoiceDate && 
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.invoiceDate.message}
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
                                    defaultValue={'ACTIVE'}
                                    name="status"
                                    render={({ field }) => (
                                        <>
                                            <Form.Select {...field} {...register("status")}>
                                                <option value={'ACTIVE'}>Activa</option>
                                                <option value={'CLOSED'}>Anulada</option>
                                                <option value={'CANCELLED'}>Cancelada</option>
                                            </Form.Select>
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

export default ProviderInvoiceCrudModal;