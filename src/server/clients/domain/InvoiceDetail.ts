import { ProductCommon } from "./ProductCommon";

export class InvoiceDetail {

    id?: string;
    invoiceId: string;
    product: ProductCommon;
    workOrderNumber: string;
    quantity: number;
    unitPrice: number;
    discountAmount:  number;
    total: number;
}