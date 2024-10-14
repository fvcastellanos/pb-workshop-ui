import { OperationTypeCommon } from "./OperationTypeCommon";
import { ProductCommon } from "./ProductCommon";
import { ResourceObject } from "./ResourceObject";

export class Inventory extends ResourceObject {

    product: ProductCommon;
    operationType?: OperationTypeCommon;
    invoiceDetailId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discountAmount?: number;
    operationDate: string;
}
