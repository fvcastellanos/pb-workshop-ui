'use client'

import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { CommonRender } from "@/src/client/commons/CommonRender";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { ProductService } from "@/src/client/services/ProductService";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { Pencil } from 'react-bootstrap-icons';
import CrudModal from "./CrudModal";
import SearchCard from "./SearchCard";
import SearchGrid from "@/src/client/components/SearchGrid";

const Products = () => {

    const service = new ProductService();

    const columns: GridColDef[] = [
        {
            field: 'id',
            width: 100,
            renderHeader: (params) => {
                return <strong>{'#'}</strong>
            },
            renderCell: (params: GridRenderCellParams) => (
                <button onClick={() => showEditModal(params.row.id)} style={{border: '0px', backgroundColor: 'transparent'}}>
                    <Pencil />
                </button>            
            ),
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'code', 
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Código'}</strong>;
            }
        },
        { 
            field: 'name', 
            width: 250,
            renderHeader: (params) => {
                return <strong>{'Nombre'}</strong>;
            }
        },
        { 
            field: 'categoryName', 
            width: 250,
            renderHeader: (params) => {
                return <strong>{'Categoría'}</strong>;
            }
        },
        { 
            field: 'type', 
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Tipo'}</strong>;
            },
            valueGetter: CommonRender.getProductType,
            align: 'center',
            headerAlign: 'center'
        },
        { 
            field: 'active', 
            width: 100,
            renderHeader: (params) => {
                return <strong>{'Activo'}</strong>;
            },
            valueGetter: CommonRender.getActiveValue,
            align: 'center',
            headerAlign: 'center'
        },
    ];

    const [searchResult, setSearchResult] = useState(CommonCrud.buildDefaultSearchResponse());
    const [searchView, setSearchView] = useState(CommonCrud.buildSearchWithTypeView());
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [showModal, setShowModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);
    const [id, setId] = useState('');

    const paginationModelChange = (page: number, size: number) => {

        setSearchView({
            ...searchView,
            size: size,
            page
        });
    }

    const showAddModal = () => {

        setModifyModal(false);
        setShowModal(true);
    }

    const showEditModal = (id: string) => {

        setId(id);
        setModifyModal(true);
        setShowModal(true);
    }

    const closeModal = () => {

        setModifyModal(false);
        setShowModal(false);
    }

    const search = async () => {

        try {

            return await service.search(searchView);    

        } catch (exception) {

            throw exception;
        }
    }
        
    const performSearch = (text: string, type: string, category: string, active: number) => {

        setErrorView(new ErrorView(false, ''));

        setSearchView({
            ...searchView,
            text,
            type,
            category,
            active,
        });
    }

    useEffect(() => {

        search().then(setSearchResult)
            .catch(setErrorView);

    }, [searchView]);

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="top-separator">
                        <h3>Productos</h3>  
                        <SearchCard performSearch={performSearch} showAddModal={showAddModal} />
                        <SearchGrid 
                                columnsDefinition={columns} 
                                errorView={errorView} 
                                content={searchResult.content}
                                rowCount={searchResult.pageable.totalElements}
                                page={searchView.page}
                                size={searchView.size}
                                paginationModelChange={paginationModelChange}
                        />

                    </div>
                </Col>
                <CrudModal 
                    displayModal={showModal} 
                    handleCloseModal={closeModal} 
                    title={modifyModal? "Modificar Producto":"Agregar Producto" }
                    editModal={modifyModal}
                    editId={id}
                    onSaveChanges={() => performSearch(searchView.text, searchView.type, searchView.category, searchView.active)}
                />
            </Row>
        </Container>
    )
}

export default Products;