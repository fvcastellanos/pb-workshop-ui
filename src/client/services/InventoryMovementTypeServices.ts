import Error from "next/error";
import { ErrorView } from "../domain/ErrorView";
import { InventoryMovementTypeView } from "../domain/InventoryMovementTypeView";
import { PagedView } from "../domain/PagedView";
import { SearchWithTypeView } from "../domain/SearchWithTypeView";
import { InventoryMovementTypeTransformer } from "@/src/common/transformers/InventoryMovementTypeTransformer";


export class InventoryMovementTypeService {

    private readonly MOVEMENT_TYPES_API: string = "/api/movement-types";

    async search(searchView: SearchWithTypeView): Promise<PagedView<InventoryMovementTypeView>> {

        try {

            const { text, active, type, page, size } = searchView;

            const url = `${this.MOVEMENT_TYPES_API}?text=${text}&active=${active}&type=${type}&page=${page}&size=${size}`;

            const response = await fetch(url);

            if (response.ok) {

                return await response.json();
            }

            const error = await response.json();
            throw error;

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async getById(id: string): Promise<InventoryMovementTypeView> {

        try {

            const url = `${this.MOVEMENT_TYPES_API}/${id}`;
            const response = await fetch(url);

            if (response.ok) {

                return await response.json();
            }

            const error = await response.json();
            throw error;

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async add(view: InventoryMovementTypeView): Promise<void> {
        
        try {

            const movementType = InventoryMovementTypeTransformer.toModel(view);

            const response = await fetch(this.MOVEMENT_TYPES_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movementType)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (error: any) {

            throw new ErrorView(true, error.message);
        }

    }

    async update(id: string, view: InventoryMovementTypeView): Promise<void> {

        try {

            const url = `${this.MOVEMENT_TYPES_API}/${id}`;
            const movementType = InventoryMovementTypeTransformer.toModel(view);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movementType)
            });

            if (response.status !== 200) {

                const error = await response.json();
                throw error;
            }
            
        } catch (error: any) {

            throw new ErrorView(true, error.message);
        }
    }

    
}