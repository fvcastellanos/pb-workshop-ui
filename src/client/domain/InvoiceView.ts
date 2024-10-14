import { IdentifiedView } from "./IdentifiedView";


export class InvoiceView extends IdentifiedView {

    type: string;
    suffix: string;
    number: string;
    imageUrl: string;
    invoiceDate: string;
    effectiveDate: string;
    status: string;

    // Contact information
    contactId?: string;
    contactName?: string;
    contactType?: string;
    contactTaxId?: string;
}