'use client'

import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import pb from '../../pb/pocketbase';
import { useAuthContext } from '../AuthProvider';

const MainMenu = () => {

  const { userModel, setUserModel } = useAuthContext();

  const authModel = userModel.authModel;

  const logoutUser = () => {

    pb.authStore.clear();
    setUserModel({
      isAuthenticated: false,
      authModel: null
    });
  };
  
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link href={"/"} passHref legacyBehavior>
          <Navbar.Brand>
            <img
                alt=""
                src="/img/logo.png"
                width="70"
                height="30"
                className="d-inline-block align-top"
              />{' '}            
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href={"/"} passHref legacyBehavior>
              <Nav.Link>Inicio</Nav.Link>
            </Link>
            <NavDropdown title="Catálogos" id="basic-nav-dropdown">

              <Link href={"/car-brands"} passHref legacyBehavior>
                <NavDropdown.Item>Marcas de Vehículos</NavDropdown.Item>
              </Link>
              <Link href={"/contacts"} passHref legacyBehavior>
                <NavDropdown.Item>Contactos</NavDropdown.Item>
              </Link>
              <Link href={"/products"} passHref legacyBehavior>
                <NavDropdown.Item>Productos</NavDropdown.Item>                
              </Link>
              <Link href={"/product-categories"} passHref legacyBehavior>
                <NavDropdown.Item>Categorías de Productos</NavDropdown.Item>
              </Link>
              <Link href={"/inventory-movement-types"} passHref legacyBehavior>
                <NavDropdown.Item>Tipos de Movimientos</NavDropdown.Item>
              </Link>

              {/* <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item> */}
            </NavDropdown>
            {/* <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}

            <Link href={"/work-orders"} passHref legacyBehavior>
              <Nav.Link>Ordenes</Nav.Link>
            </Link>

            <NavDropdown title="Movimientos" id="basic-nav-dropdown">
              <Link href={"/provider-invoices"} passHref legacyBehavior>
                <NavDropdown.Item>Facturas Proveedores</NavDropdown.Item>
              </Link>
            </NavDropdown>

            <NavDropdown title="Inventario" id="basic-nav-dropdown">
                <Link href={"/inventory/initial"} passHref legacyBehavior>
                  <NavDropdown.Item>Inicial</NavDropdown.Item>
                </Link>
                <Link href={"/inventory"} passHref legacyBehavior>
                  <NavDropdown.Item>Movimientos</NavDropdown.Item>
                </Link>
                <Link href={"/inventory"} passHref legacyBehavior>
                  <NavDropdown.Item>Existencias</NavDropdown.Item>
                </Link>
            </NavDropdown>
          </Nav>
          <Nav className='justify-content-end' style={{width: "100%"}}>
            <NavDropdown title={authModel.name} id="nvProfile" className='ml-auto' >
              <NavDropdown.Item onClick={logoutUser}>LogOut</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>    
  );
}

export default MainMenu;
