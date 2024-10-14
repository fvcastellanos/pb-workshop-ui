'use client'

import { Col, Container, Row } from "react-bootstrap";
import SearchCard from "./SearchCard";
import SearchGrid from "@/src/client/components/SearchGrid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { Pencil } from "react-bootstrap-icons";
import { CommonRender } from "@/src/client/commons/CommonRender";
import { useEffect, useState } from "react";
import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { ProductCategoryService } from "@/src/client/services/ProductCategoryService";
import CrudModal from "./CrudModal";

const ProductCategories = () => {

    const service: ProductCategoryService = new ProductCategoryService();

    const columns: GridColDef[] = [
        {
            field: 'id',
            width: 150,
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
            width: 150,
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
            field: 'active', 
            width: 150,
            renderHeader: (params) => {
                return <strong>{'Activo'}</strong>;
            },
            valueGetter: CommonRender.getActiveValue,
            align: 'center',
            headerAlign: 'center'
        },
    ];

    const [searchResult, setSearchResult] = useState(CommonCrud.buildDefaultSearchResponse());
    const [searchView, setSearchView] = useState(CommonCrud.buildDefaultSearchView());
    const [errorView, setErrorView] = useState(new ErrorView(false, ''));
    const [showModal, setShowModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);
    const [id, setId] = useState('');

    const paginationModelChange = (page: number, size: number) => {
            
            setSearchView({
                ...searchView,
                page,
                size
            });
    }

    const search = async () => {

        try {

            return await service.search(searchView);    

        } catch (exception) {

            throw exception;
        }
    }

    const performSearch = (text: string, active: number) => {

        setErrorView(new ErrorView(false, ''));

        setSearchView({
            ...searchView,
            text,
            active
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

    useEffect(() => {

        search().then(setSearchResult)
            .catch(setErrorView);

    }, [searchView])

    return (
        <Container fluid={true}>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="top-separator">
                        <h3>Categorías de Productos</h3>  
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
                        <CrudModal 
                            displayModal={showModal} 
                            handleCloseModal={closeModal} 
                            title={modifyModal? "Modificar Categoría":"Agregar Categoría" }
                            editModal={modifyModal}
                            editId={id}
                            onSaveChanges={() => performSearch(searchView.text, searchView.active)}

                        />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ProductCategories;