import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Trash, Pencil } from 'react-bootstrap-icons';
import { InvoiceDetailView } from "@/src/client/domain/InvoiceDetailView";
import { ErrorView } from "@/src/client/domain/ErrorView";
import * as yup from 'yup';
import Alert from "@/src/client/components/Alert";

const DetailGrid = ({ invoiceDetails, 
                      deleteAction,
                      editAction,
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
        workOrderNumber: yup.string()
                .notRequired()
                .max(100, 'La longitud máxima es de 100 caracteres'),                
    });    

    const columns: GridColDef[] = [
        {
            field: 'id',
            width: 80,
            renderHeader: (params) => {
                return <strong>{'#'}</strong>
            },
            renderCell: (params: GridRenderCellParams<any>) => {

                return (
                    <>
                        <button onClick={() => editAction(params.row)} className={"icon-action"}>
                            <Pencil />
                        </button>
                        <button onClick={() => deleteAction(params.row)} className={"icon-action"}>
                            <Trash />
                        </button>            
                    </>
                )
            },
            align: 'center',
            headerAlign: 'center'
        },
        { 
            field: 'quantity', 
            align: 'right',
            flex: 0.08,
            minWidth: 80,
            renderHeader: (params) => {
                return <strong>{'Cantidad'}</strong>;
            },
        },
        {
            field: 'productCode', 
            flex: 0.15,
            minWidth: 120,
            renderHeader: (params) => {
                return <strong>{'Código'}</strong>;
            },
        },
        {
            field: 'productName', 
            flex: 0.3,
            width: 250,
            renderHeader: (params) => {
                return <strong>{'Producto'}</strong>;
            }
        },
        { 
            field: 'unitPrice', 
            align: 'right',
            flex: 0.09,
            width: 80,
            renderHeader: (params) => {
                return <strong>{'P. Unitario'}</strong>;
            },
        },
        {
            field: 'discountPercentage',
            align: 'right',
            flex: 0.09,
            width: 60,
            valueGetter: (value, row) => {

                if (row.discountAmount) {

                    return (row.discountAmount * 100) / (row.unitPrice * row.quantity)
                }

                return 0;

            },
            renderHeader: (params) => {
                return <strong>{'% Des.'}</strong>;
            },
        },
        {
            field: 'discountAmount',
            align: 'right',
            flex: 0.09,
            width: 70,
            renderHeader: (params) => {
                return <strong>{'Desc.'}</strong>;
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
        { 
            field: 'workOrderNumber', 
            align: 'left',
            flex: 0.1,
            width: 90,
            renderHeader: (params: GridColumnHeaderParams) => {
                return <strong>{'No. Orden'}</strong>;
            },
        },
    ];  

    const [errorView, setErrorView] = useState<ErrorView>(new ErrorView(false, ''));
    const [details, setDetails] = useState<InvoiceDetailView[]>([]);

    function cleanErrorView() {

        setErrorView(new ErrorView(false, ''));
    }

    useEffect(() => {

        setDetails(invoiceDetails);
    }, [invoiceDetails.length]);

    return (
        <>
            <div className='top-separator'>
                <Alert 
                    show={errorView.show} 
                    message={errorView.message} 
                    variant={"danger"}
                    dismissible={true}
                    onDismiss={cleanErrorView}
                />

                <div style={{ height: 400, marginTop: '0.5em'}}>

                    <DataGrid 
                        columns={columns}
                        rows={details}
                        rowCount={details.length}
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                    />

                </div>
            </div>
            <div className='top-separator'></div>
        </>
    );
}

export default DetailGrid;
