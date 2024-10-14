import Alert from "@/src/client/components/Alert";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

const SearchGrid = ({errorView, 
                    columnsDefinition, 
                    rowCount, 
                    content, 
                    paginationModelChange,
                    size,
                    page}) => {

    const [ paginationModel, setPaginationModel ] = useState({
        page: page,
        pageSize: size
    });

    const onPaginationModelChange = (newModel: any) => {

        paginationModelChange(page, size);
        setPaginationModel(newModel);
    }

    return (
        <>
            <div className='top-separator'>
                <Alert variant='danger' show={errorView.hasError} message={errorView.message} />
                <div style={{ height: 400, width: '100%' }}>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ flexGrow: 1 }}>
                            <DataGrid 
                                columns={columnsDefinition}
                                disableColumnMenu
                                rows={content}
                                rowCount={rowCount}
                                pagination
                                paginationMode='server'
                                pageSizeOptions={[ 10, 25, 50, 100 ]}
                                paginationModel={paginationModel}
                                onPaginationModelChange={onPaginationModelChange}
                                getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='top-separator'></div>
        </>
    )

}

export default SearchGrid;