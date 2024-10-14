import { Product } from "./Product";

export class WorkOrderDetail {

    id?: string;
    orderId: string;
    product: Product;
    invoiceDetailId?: string;
    quantity: number;
    unitPrice: number;
}