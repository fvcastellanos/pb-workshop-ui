
export class CommonRender {

    static getActiveValue(value: string): string {

        return value === 'ACTIVE' ? 'Activo'
                : 'Inactivo';
    }

    static getContactType(value: string): string {

        return value === 'PROVIDER' ? 'Proveedor' 
                : 'Cliente';
    }

    static getProductType(value: string): string {

        return value === 'PRODUCT'? 'Producto' 
                : 'Servicio';
    }

    static getWorkOrderStatus(value: string): string {

        switch(value) {

            case 'CANCELLED': return 'Cancelada';
            case 'CLOSED': return 'Cerrada';
            case 'DELIVERED': return 'Entregada';
            case 'IN_PROGRESS': return 'En Proceso'
            default: return 'Desconocido';
        }
    }

    static getInvoiceStatus(value: string): string {

        switch(value) {

            case 'ACTIVE': return 'Activa';
            case 'CLOSED': return 'Anulada';
            case 'CANCELLED': return 'Cancelada';
            default: return 'Desconocido';
        }
    }

    static getInventoryMovementType(value: string): string {

        switch(value) {

            case 'INPUT': return 'Entrada';
            case 'OUTPUT': return 'Salida';
            default: return 'Desconocido';
        }
    }
}
