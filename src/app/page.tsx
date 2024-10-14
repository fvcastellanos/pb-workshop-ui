'use client'

import { Col, Container, Row } from "react-bootstrap";
import pb from "../client/pb/pocketbase";

export default function Home() {

  const authModel = pb.authStore.model;

  return (
    <Container fluid={true}>
      <Row className="justify-content-center">
          <Col md={10}>
              <div className='top-separator'>
                  <h3>Bienvenido!</h3>
                  <div className='top-separator'></div>
                  <p>{authModel?.name}</p>
              </div>
          </Col>
      </Row>
    </Container>        
  )
}
