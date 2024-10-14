import { InventoryView } from "@/src/client/domain/InventoryView";
import { Inventory } from "@/src/server/clients/domain/Inventory";
import { CommonTransformer } from "./CommonTransformer";

export class InventoryTransformer {

    static toWeb(inventory: Inventory): InventoryView {

        return {

            id: CommonTransformer.getId(inventory),
            description: inventory.description,
            discountAmount: inventory.discountAmount,
            quantity: inventory.quantity,
            unitPrice: inventory.unitPrice,
            total: (inventory.unitPrice * inventory.quantity) - inventory.discountAmount,
            invoiceDetailId: inventory.invoiceDetailId,
            operationType: inventory.operationType.code,
            productCode: inventory.product.code,
            operationDate: inventory.operationDate,
            productName: inventory.product.name
        };
    }

    static toModel(view: InventoryView): Inventory {

        return {
            quantity: view.quantity,
            unitPrice: view.unitPrice,
            operationDate: this.formatToISODate(view.operationDate),
            description: view.description,
            product: {
                code: view.productCode,
                name: view.productName,
            },
            operationType: {
                code: view.operationType
            },
        }
    }

    static formatToISODate(date: string): string {

        var dateObject = new Date(date);
        return dateObject.toISOString().split('T')[0];
    }
}
