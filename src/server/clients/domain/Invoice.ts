import { ResourceObject } from "./ResourceObject";
import { ContactCommon } from "./ContactCommon";

export class Invoice extends ResourceObject {

    type: string;
    suffix: string;
    number: string;
    imageUrl: string;
    invoiceDate: string;
    effectiveDate: string;
    status: string;
    contact: ContactCommon
}