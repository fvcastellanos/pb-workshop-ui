import { InvoiceDetail } from "@/src/server/clients/domain/InvoiceDetail";
import { InvoiceDetailView } from "@/src/client/domain/InvoiceDetailView";

export class InvoiceDetailTransformer {

    static toWeb(detail: InvoiceDetail): InvoiceDetailView {

        return {
            id: detail.id,
            productCode: detail.product.code,
            productName: detail.product.name,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            discountAmount: detail.discountAmount,
            total: (detail.quantity * detail.unitPrice) - detail.discountAmount,
            workOrderNumber: detail.workOrderNumber
        }
    }

    static toModel(invoiceId: string, view: InvoiceDetailView): InvoiceDetail {

        return {

            invoiceId,
            quantity: view.quantity,
            unitPrice: view.unitPrice,
            discountAmount: view.discountAmount,
            workOrderNumber: view.workOrderNumber,
            total: 0,
            product: {
                code: view.productCode,
                name: view.productName,
                type: null

            }
        }
    }
}