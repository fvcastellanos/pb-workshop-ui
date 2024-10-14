import { Invoice } from "@/src/server/clients/domain/Invoice";
import { BaseTransformer } from "./BaseTransformer";
import { InvoiceView } from "@/src/client/domain/InvoiceView";
import { CommonTransformer } from "./CommonTransformer";

export class InvoiceTransformer extends BaseTransformer {

    static toView(invoice: Invoice): InvoiceView {

        return {

            id: CommonTransformer.getId(invoice),
            type: invoice.type,
            suffix: invoice.suffix,
            imageUrl: invoice.imageUrl,
            number: invoice.number,
            effectiveDate: invoice.effectiveDate,
            invoiceDate: invoice.invoiceDate,
            status: invoice.status,
            contactId: invoice.contact.id,
            contactName: invoice.contact.name,
            contactTaxId: invoice.contact.taxId,
            contactType: invoice.contact.type
        }

    }

    static toModel(view: InvoiceView): Invoice {

        return {
            suffix: view.suffix,
            number: view.number,
            effectiveDate: view.effectiveDate,
            type: view.type,
            imageUrl: view.imageUrl,
            invoiceDate: view.invoiceDate,
            status: view.status,
            contact: {
                id: view.contactId,
                name: view.contactName,
                taxId: view.contactTaxId,
                type: view.contactType
            }
        }
    }
}