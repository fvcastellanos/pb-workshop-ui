import { WorkOrderDetailView } from "@/src/client/domain/WorkOrderDetailView";
import { WorkOrderDetail } from "@/src/server/clients/domain/WorOrderDetail";
import { BaseTransformer } from "./BaseTransformer";

export class WorkOrderDetailTransformer extends BaseTransformer {

    static toView(workOrderDetail: WorkOrderDetail): WorkOrderDetailView {

        return {
            id: workOrderDetail.id,
            productCode: workOrderDetail.product.code,
            productName: workOrderDetail.product.name,
            quantity: workOrderDetail.quantity,
            unitPrice: workOrderDetail.unitPrice
        };
    }

    static toModel(workOrderId: string, view: WorkOrderDetailView): WorkOrderDetail {

        return {
            orderId: workOrderId,
            product: {
                code: view.productCode,
                name: view.productName,
                active: null,
                type: null,
                minimalQuantity: 0,
                description: null
            },
            quantity: view.quantity,
            unitPrice: view.unitPrice,
            id: null,
            invoiceDetailId: null,
        }
    }
}