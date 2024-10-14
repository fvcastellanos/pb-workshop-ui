'use client'

import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { InventoryView } from "@/src/client/domain/InventoryView";
import { PagedView } from "@/src/client/domain/PagedView";
import { SearchWithDateRangeView } from "@/src/client/domain/SearchWithDateRangeView";
import { InventoryService } from "@/src/client/services/InventoryService";
import { SearchResponse } from "@/src/server/clients/domain/SearchResponse";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InventoryGrid from "./InventoryGrid";


const Inventory = () => {


    const service = new InventoryService();

    const [movements, setMovements] = useState<InventoryView[]>([]);
    const [searchView, setSearchView] = useState<SearchWithDateRangeView>(CommonCrud.buildSearchWithDateRangeView());
    const [searchResult, setSearchResult] = useState<PagedView<InventoryView>>(CommonCrud.buildDefaultSearchResponse<InventoryView>());
    const [errorView, setErrorView] = useState<ErrorView>(new ErrorView(false, ''));

    useEffect(() => {

        service.search(searchView)
            .then(setSearchResult)
            .catch(setErrorView);

    }, [movements.length]);

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className='top-separator'>
                        <h3>Inventario</h3>
                        <div className='top-separator'>
                            <InventoryGrid 
                                deleteAction={() => {}}
                                onSaveChanges={() => {}}
                                saveChanges={() => {}}
                                movements={searchResult.content}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>

    );
}

export default Inventory;
