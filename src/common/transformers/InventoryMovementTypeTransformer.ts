import { InventoryMovementTypeView } from "@/src/client/domain/InventoryMovementTypeView";
import { InventoryMovementType } from "@/src/server/clients/domain/InventoryMovementType";
import { CommonTransformer } from "./CommonTransformer";

export class InventoryMovementTypeTransformer {

    static toWeb(type: InventoryMovementType): InventoryMovementTypeView {

        return {
        
            id: CommonTransformer.getId(type),
            name: type.name,
            code: type.code,
            type: type.type,
            description: type.description,
            active: type.active
        }
    }

    static toModel(view: InventoryMovementTypeView): InventoryMovementType {

        return {

            code: view.code,
            name: view.name,
            description: view.description,
            type: view.type,
            active: view.active
        }
    }
}