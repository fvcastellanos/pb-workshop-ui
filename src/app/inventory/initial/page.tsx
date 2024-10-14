'use client'

import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { InventoryView } from "@/src/client/domain/InventoryView";
import { SearchWithDateRangeView } from "@/src/client/domain/SearchWithDateRangeView";
import { InventoryService } from "@/src/client/services/InventoryService";
import { ErrorView } from "@/src/client/domain/ErrorView";
import SearchCard from "./SearchCard";
import EditModal from "./EditModal";
import { ProductService } from "@/src/client/services/ProductService";
import { SearchWithTypeView } from "@/src/client/domain/SearchWithTypeView";
import { ProductView } from "@/src/client/domain/ProductView";
import Message from "@/src/client/components/Message";
import { InventoryTransformer } from "@/src/common/transformers/InventoryTransformer";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Pencil, Trash } from "react-bootstrap-icons";
import SearchGrid from "@/src/client/components/SearchGrid";
import { CommonCrud } from "@/src/client/commons/CommonCrud";
import DeleteModal from "./DeleteModal";


const InitialInventory = () => {

    const columns: GridColDef[] = [
        {
            field: 'id',
            width: 150,
            renderHeader: (params) => {
                return <strong>{'#'}</strong>
            },
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <button onClick={() => editAction(params.row)} style={{border: '0px', backgroundColor: 'transparent'}}>
                        <Pencil />
                    </button>            
                    <button onClick={() => deleteAction(params.row)} className={"icon-action"}>
                        <Trash />
                    </button>            
                </>

            ),
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'operationDate', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Fecha'}</strong>;
            }
        },
        { 
            field: 'quantity', 
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Cantidad'}</strong>;
            }
        },
        { 
            field: 'productCode', 
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Código'}</strong>;
            }
        },
        { 
            field: 'productName', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Producto'}</strong>;
            },
            headerAlign: 'center'
        },
        { 
            field: 'unitPrice', 
            width: 100,
            align: 'right',
            renderHeader: (params) => {
                return <strong>{'P. Unitario'}</strong>;
            }
        },
        { 
            field: 'total', 
            width: 100,
            align: 'right',
            renderHeader: (params) => {
                return <strong>{'Total'}</strong>;
            }
        },
    ];


    const service: InventoryService = new InventoryService();
    const productService = new ProductService();

    const [searchResult, setSearchResult] = useState(CommonCrud.buildDefaultSearchResponse());
    const [movements, setMovements] = useState<InventoryView[]>([]);
    const [movement, setMovement] = useState<InventoryView>(new InventoryView());
    const [errorView, setErrorView] = useState<ErrorView>(ErrorView.buildEmptyErrorView());

    const [searchView, setSearchView] = useState<SearchWithDateRangeView>({
        initialDate: '2001-01-01',
        finalDate: '2099-12-31',
        text: '',
        type: '',
        page: 0,
        size: 50
    });

    const [displayModal, setDisplayModal] = useState<boolean>(false);
    const [isNew, setIsNew] = useState<boolean>(false);

    const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false);
    const [deleteData, setDeleteData] = useState<InventoryView>(new InventoryView());

    const [products, setProducts] = useState<ProductView[]>([]);

    const addAction = function () {

        setIsNew(true);
        setDisplayModal(true);
        setMovement(null);
    }

    const editAction = function (movement: InventoryView) {

        setIsNew(false);
        setMovement(movement);
        setDisplayModal(true);
    }

    const closeAction = function () {   
            
        setDisplayModal(false);
    }

    function deleteAction(movement: InventoryView) {

        setErrorView(ErrorView.buildEmptyErrorView());
        setDeleteData(movement);
        setDisplayDeleteModal(true);
    }

    function hideDeleteModal() {
        setDisplayDeleteModal(false);
    }

    function deleteMovement(movement: InventoryView) {

        setErrorView(ErrorView.buildEmptyErrorView());

        setDisplayDeleteModal(false);
        service.delete(movement.id)
            .then(() => {
                setMovements([]);
                setSearchView({
                    text: '',
                    ...searchView
                });
            }).catch(setErrorView);
    }

    const performSearch = (initialDate: string, finalDate: string) => {

        setErrorView(ErrorView.buildEmptyErrorView());

        if (initialDate !== undefined && finalDate === undefined) {

            setErrorView(ErrorView.buildErrorView('Debe seleccionar una fecha final'));
            return;
        }

        setSearchView({
            initialDate: initialDate ? InventoryTransformer.formatToISODate(initialDate) : '2001-01-01',
            finalDate: finalDate ? InventoryTransformer.formatToISODate(finalDate) : '2099-12-31',
            ... searchView
        });
    
    }

    const loadProducts = function () {  

        const search: SearchWithTypeView = {
            text: '%',
            type: '%',
            active: 1,
            category: '%',
            page: 0,
            size: 500
        };

        productService.search(search)
            .then(response => setProducts(response.content))
            .catch(setErrorView);
    }

    useEffect(() => {

        loadProducts();

    }, [products.length]);

    useEffect(() => {

        service.searchInitialMovement(searchView)
            .then(setSearchResult)
            .catch(setErrorView);

    }, [searchView, movements.length]);

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className='top-separator'>
                        <h4>Inventario Inicial</h4>
                        <SearchCard performSearch={performSearch} showAddModal={addAction} />
                        <div className='top-separator'>
                            <Message show={errorView.show} 
                                message={errorView.message} 
                                variant="danger" 
                                details={errorView.details}
                                fieldErrors={errorView.fieldErrors}
                            />

                            <SearchGrid
                                columnsDefinition={columns}
                                errorView={ErrorView.buildEmptyErrorView()}
                                content={searchResult.content}
                                rowCount={searchResult.pageable.totalElements}
                                page={searchView.page}
                                size={searchView.size}
                                paginationModelChange={(page: number, size: number) => {
                                    CommonCrud.paginationModelChange(searchView, page, size);
                                }}
                            />

                            <EditModal header={isNew ? 'Agregar Movimiento Inicial' : 'Modificar Movimiento Inicial'} 
                                displayModal={displayModal} 
                                isNew={isNew}
                                closeAction={closeAction}
                                movement={movement}
                                products={products}
                                onSaveAction={() => {
                                    setSearchView({
                                        text: '',
                                        ...searchView
                                    })
                                    setMovements([]);
                                }}
                            />

                            <DeleteModal 
                                displayModal={displayDeleteModal}
                                hideDeleteModal={hideDeleteModal}
                                deleteData={deleteData}
                                deleteAction={deleteMovement}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default InitialInventory;