'use client'

import { Col, Container, Row } from "react-bootstrap";
import SearchCard from "./SearchCard";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Pencil } from "react-bootstrap-icons";
import { CommonRender } from "@/src/client/commons/CommonRender";
import SearchGrid from "@/src/client/components/SearchGrid";
import { useEffect, useState } from "react";
import { ErrorView } from "@/src/client/domain/ErrorView";
import { CommonCrud } from "@/src/client/commons/CommonCrud";
import { InventoryMovementTypeService } from "@/src/client/services/InventoryMovementTypeServices";
import CrudModal from "./CrudModal";

const InventoryMovementTypes = () => {

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
            field: 'type', 
            width: 100,
            valueGetter: CommonRender.getInventoryMovementType,
            renderHeader: (params) => {
                return <strong>{'Tipo'}</strong>;
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

    const service = new InventoryMovementTypeService();

    const [searchResult, setSearchResult] = useState(CommonCrud.buildDefaultSearchResponse());
    const [searchView, setSearchView] = useState(CommonCrud.buildSearchWithTypeView);
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

    const performSearch = (text: string, type: string, active: number) => {

        setErrorView(new ErrorView(false, ''));

        setSearchView({
            ...searchView,
            text,
            type,
            active
        });
    }

    useEffect(() => {

        service.search(searchView)
            .then(setSearchResult)
            .catch(setErrorView);

    }, [searchView]);

    return (

        <Container fluid>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className='top-separator'>
                        <h3>Tipos de Movimiento</h3>
                        <SearchCard 
                            performSearch={performSearch} 
                            showAddModal={showAddModal}
                        />
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
                    editModal={modifyModal}
                    editId={id}
                    onSaveChanges={() => performSearch(searchView.text, searchView.type, searchView.active)}
                    handleCloseModal={closeModal}
                    title={modifyModal? "Modificar Tipo de Movimiento":"Agregar Tipo de Movimiento" }
                />
            </Row>
        </Container>
    )

}

export default InventoryMovementTypes;