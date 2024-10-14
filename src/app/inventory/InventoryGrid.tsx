import AutoComplete from '@/src/client/components/AutoComplete';
import { DataGrid, GridColDef, GridRenderCellParams, GridRenderEditCellParams, GridRowModel, GridRowModes, GridRowModesModel, GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import { Pencil, Trash, XCircle, Check } from 'react-bootstrap-icons';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { ProductView } from '@/src/client/domain/ProductView';
import { ErrorView } from '@/src/client/domain/ErrorView';
import { ProductService } from '@/src/client/services/ProductService';
import { SearchWithTypeView } from '@/src/client/domain/SearchWithTypeView';
import { v4 as uuidv4 } from 'uuid';
import { InventoryView } from '@/src/client/domain/InventoryView';


const InventoryGrid = ({ movements, 
                         saveChanges,
                         onSaveChanges,
                         deleteAction,
                      }) => {

    const schema = yup.object({
        quantity: yup.number()
                .typeError('El valor debe ser numérico')
                .required('Cantidad es requerido')
                .min(1, 'La cantidad debe ser mayor o igual que 1'),
        unitPrice: yup.number()
                .typeError('El valor debe ser numérico')
                .required('Precio unitario es requerido')
                .min(0, 'El precio unitario debe ser mayor o igual que 0'),
        productCode: yup.string()
                .required('Código Producto es necesario')
                .max(50, 'La longitud máxima es de 50 caracteres'),
    });    

    const columns: GridColDef[] = [
        {
            field: 'id',
            width: 80,
            renderHeader: (params) => {
                return <strong>{'#'}</strong>
            },
            renderCell: (params: GridRenderCellParams<any>) => {

                const isInEditMode: boolean = rowModesModel[params.id]?.mode === GridRowModes.Edit;

                if (!isInEditMode) {

                    return (
                        <>
                            <button onClick={() => setEditMode(params.row)} className={"icon-action"}>
                                <Pencil />
                            </button>
                            <button onClick={() => deleteAction(params.row)} className={"icon-action"}>
                                <Trash />
                            </button>            
                        </>
                    )
                }

                return (
                    <>
                        <button onClick={() => cancelEditMode(params.row.id)} className={"icon-action"}>
                            <XCircle />
                        </button>
                        <button onClick={() => acceptChanges(params.row.id)} className={"icon-action"}>
                            <Check />
                        </button>            
                    </>
                );
            },
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'operationDate',
            editable: true,
            align: 'right',
            flex: 0.08,
            minWidth: 80,
            renderHeader(params) {
                return <strong>{'Fecha'}</strong>
            },
        },
        { 
            field: 'quantity', 
            editable: true,
            align: 'right',
            flex: 0.08,
            minWidth: 80,
            renderHeader: (params) => {
                return <strong>{'Cantidad'}</strong>;
            },
        },
        {
            field: 'productCode', 
            editable: true,
            flex: 0.15,
            minWidth: 120,
            renderHeader: (params) => {
                return <strong>{'Código'}</strong>;
            },
            renderEditCell: (params: GridRenderEditCellParams) => (
                <AutoComplete
                    label={"Productos"}
                    options={products}
                    performSearch={searchProduct}
                    onValueChange={onValueChange}
                    currentValue={() => buildAutoCompleteValue(params.row)}
                />
            )
        },
        {
            field: 'productName', 
            flex: 0.25,
            width: 190,
            renderHeader: (params) => {
                return <strong>{'Producto'}</strong>;
            }
        },
        { 
            field: 'unitPrice', 
            editable: true,
            align: 'right',
            flex: 0.09,
            width: 80,
            renderHeader: (params) => {
                return <strong>{'P. Unitario'}</strong>;
            },
        },
        { 
            field: 'total', 
            align: 'right',
            flex: 0.1,
            width: 80,
            renderHeader: (params) => {
                return <strong>{'Total'}</strong>;
            }
        },
    ];  

    // Component state definition
    const apiRef = useGridApiRef();
    const productService = new ProductService();

    const [isNew, setIsNew] = useState(false);
    const [products, setProducts] = useState([]);
    const [productSelected, setProductSelected] = useState<ProductView>();
    const [errorView, setErrorView] = useState<ErrorView>(new ErrorView(false, ''));

    const [inventoryMovements, setInventoryMovements] = useState<InventoryView[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});    


    // Product typeahead

    const buildAutoCompleteValue = (row: any) => {

        return {
            id: row.productCode,
            label: row.productName
        };
    }

    const buildSelectedProduct = (row: any) => {

        const product = new ProductView();
        product.code = row.productCode;
        product.name = row.productName;

        return product;
    }

    const searchProduct = (query: string) => {

        const search: SearchWithTypeView = {

            text: query,
            type: '%',
            page: 0,
            size: 200,
            category: '%',
            active: 1
        }

        productService.search(search).then(response => {

            const products = response.content.map(view => ({
                id: view.code,
                label: view.name
            }));

            setProducts(products);

        }).catch(error => {

            setErrorView(error);
        });   
    }

    function onValueChange(selected: any) {

        setProductSelected(selected);    
    }

    function cleanErrorView() {

        setErrorView(new ErrorView(false, ''));
    }

    // Grid events
    
    function updateRowValues(newRow: any) {

        if (productSelected) {

            newRow.productName = productSelected.name;
            newRow.productCode = productSelected.code;    
        }
        
        const discountAmount = newRow.unitPrice * (newRow.discountPercentage / 100);

        newRow.total = (newRow.quantity * newRow.unitPrice) - discountAmount;
        newRow.discountAmount = discountAmount;
    }

    const validateRow = async (newRow: GridRowModel) => {

        try {

            await schema.validate(newRow);

        } catch (error) {

            throw new ErrorView(true, error.errors[0]);
        }        
    }

    const processRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel): Promise<GridRowModel> => {

        cleanErrorView();
        updateRowValues(newRow);

        await validateRow(newRow);

        try {

            // await saveChanges(invoiceId, newRow, isNew);

            if (isNew) {

                setIsNew(false);
            }

            onSaveChanges();

            return newRow;

        } catch(errorView) {

            setErrorView(errorView);

            return oldRow;
        }            
    };

    const handleProcessRowUpdateError = async (error: any) => {

        setErrorView(error);
    }

    // CRUD functions

    function setEditMode(row: any) {

        const id = row.id;

        setRowModesModel(() => ({

            ... rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'quantity' }
        }));

        setProductSelected(buildSelectedProduct(row));
    }

    function acceptChanges(id: string) {

        setRowModesModel(() => ({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View }
        }));
    }

    function cancelEditMode(id: string) {

        setRowModesModel(() => ({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true }
        }));

        if (isNew) {

            setInventoryMovements(inventoryMovements.filter(movement => movement.id !== id));
            setIsNew(false);
        }

        cleanErrorView();
    }

    function addRow() {

        const id = uuidv4();

        const movement = new InventoryView();
        movement.id = id;
        movement.productCode = '';
        movement.productName = '';

        setInventoryMovements(() => [...inventoryMovements, movement]);

        setRowModesModel(() => ({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'quantity' }
        }))

        setIsNew(true);
    }

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowEditStop = (params: GridRowParams) => {

        if (isNew) {

            setInventoryMovements(movements.filter(movement => movement.id !== params.id))
            setIsNew(false);
        }

        cleanErrorView();
    }

    useEffect(() => {

        setInventoryMovements(movements);
    }, [movements.length]);

    return (

        <DataGrid 
            apiRef={apiRef}
            editMode="row"
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            rows={inventoryMovements}
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            rowCount={inventoryMovements.length}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
        />
    );
}

export default InventoryGrid;
