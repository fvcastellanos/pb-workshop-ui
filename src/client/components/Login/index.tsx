'use client'

import { Formik } from "formik";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import * as yup from 'yup';
import { login } from "../../pb/auth";

import { useRouter } from 'next/navigation';
import Alert from "../Alert";
import { useState } from "react";
import { ErrorView } from "../../domain/ErrorView";
import { useAuthContext } from "../AuthProvider";

const schema = yup.object({
    user: yup.string()
            .required('Usuario es requerido')
            .max(50, 'La longitud máxima es de 50 caracteres'),
    password: yup.string()
                .required('Contraseña es requerida')
                .max(50, 'La longitud máxima es de 50 caracteres')
});

const Login = () => {

    const { userModel, setUserModel } = useAuthContext();

    const router = useRouter();
    const [error, setError] = useState(new ErrorView(false, ''))

    const onSubmit = async (values: any) => {

        try {

            setError(new ErrorView(false, ''));

            const model = await login(values.user, values.password);
            
            setUserModel({
                isAuthenticated: true,
                authModel: model
            });

            // router.push('/');
            

        } catch (error) {

            setError({
                show: true,
                message: 'Usuario o contraseña incorrectos'
            });
        }

    };

    return (

        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md={4}>
                    <div style={{marginTop: '2em'}} data-testid="login-component">
                        <Formik
                            validationSchema={schema}
                            onSubmit={onSubmit}
                            initialValues={{
                                user: '', 
                                password: ''
                            }}
                        >
                        {
                            ({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => {

                                return (
                                            <Form noValidate onSubmit={handleSubmit}>
                                                <Alert show={error.show} message={error.message} variant='danger' dismissible={true} />
                                                <Card>
                                                    <Card.Header>Iniciar Sesión</Card.Header>
                                                    <Card.Body>
                                                        <Container fluid={true}>

                                                            <Row className="justify-content-center">

                                                                <Col md={12}>
                                                                    <Form.Label>Usuario</Form.Label>
                                                                    <Form.Control
                                                                            name="user" 
                                                                            type='text'
                                                                            value={values.user} 
                                                                            onChange={handleChange} 
                                                                            isValid={touched.user && !errors.user}
                                                                            isInvalid={errors.user? true: false}                                                                            
                                                                        />
                                                                    <Form.Control.Feedback type="invalid">{errors.user}</Form.Control.Feedback>
                                                                </Col>                                                    
                                                                <Col>
                                                                    <Form.Label>Contraseña</Form.Label>
                                                                    <Form.Control
                                                                            name="password" 
                                                                            type='password'
                                                                            value={values.password} 
                                                                            onChange={handleChange} 
                                                                            isValid={touched.password && !errors.password}
                                                                            isInvalid={errors.password? true: false}
                                                                        />
                                                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                                                </Col>
                                                            </Row>

                                                        </Container>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Button variant="primary" type='submit'>
                                                            Login
                                                        </Button>
                                                    </Card.Footer>
                                                </Card>   
                                            </Form>                 
                                        )
                                    }
                            }
                        </Formik>
                    </div>
                </Col>
            </Row>
        </Container>        
    );
}

export default Login;
