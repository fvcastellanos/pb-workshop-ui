import { WorkOrderView } from "@/src/client/domain/WorkOrderView";
import { WorkOrder } from "@/src/server/clients/domain/WorkOrder";
import { BaseTransformer } from "./BaseTransformer";
import { CommonTransformer } from "./CommonTransformer";

export class WorkOrderTransformer extends BaseTransformer {

    static toView(workOrder: WorkOrder): WorkOrderView {

        return {
            id: CommonTransformer.getId(workOrder),
            number: workOrder.number,
            status: workOrder.status,
            odometerMeasurement: workOrder.odometerMeasurement,
            odometerValue: workOrder.odometerValue,
            gasAmount: workOrder.gasAmount,
            notes: workOrder.notes,
            plateNumber: workOrder.plateNumber,
            orderDate: workOrder.orderDate,
            carLineId: workOrder.carLine.id,
            carLineName: workOrder.carLine.name,
            contactId: workOrder.contact.id,
            contactName: workOrder.contact.name,
            contactType: workOrder.contact.type,
            contactTaxId: workOrder.contact.taxId
        }
    }

    static toModel(view: WorkOrderView): WorkOrder {

        return {
            number: view.number,
            status: view.status,
            odometerMeasurement: view.odometerMeasurement,
            odometerValue: view.odometerValue,
            gasAmount: view.gasAmount,
            notes: view.notes,
            plateNumber: view.plateNumber,
            orderDate: view.orderDate,
            carLine: {
                id: view.carLineId,
                name: view.carLineName,
            },
            contact: {
                id: view.contactId,
                name: view.contactName,
                type: view.contactType,
                taxId: view.contactTaxId
            }
        };
    }    
}