import { ErrorView } from "../domain/ErrorView";
import { InventoryView } from "../domain/InventoryView";
import { PagedView } from "../domain/PagedView";
import { SearchWithDateRangeView } from "../domain/SearchWithDateRangeView";
import { Inventory } from "@/src/server/clients/domain/Inventory";
import { ServiceBase } from "./ServiceBase";
import { InventoryTransformer } from "@/src/common/transformers/InventoryTransformer";

export class InventoryService extends ServiceBase {

    private readonly MOVEMENTS_API: string = "/api/movements";

    async search(searchView: SearchWithDateRangeView): Promise<PagedView<InventoryView>> {

        try {

            const url = `${this.MOVEMENTS_API}?type=${searchView.type}&text=${searchView.text}&initialDate=${searchView.initialDate}&finalDate=${searchView.finalDate}&page=${searchView.page}&size=${searchView.size}`;

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

    async getById(id: string): Promise<InventoryView> {

        try {

            const url = `${this.MOVEMENTS_API}/${id}`;

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

    async add(view: InventoryView): Promise<void> {

        try {

            const movement = InventoryTransformer.toModel(view);

            const response = await fetch(this.MOVEMENTS_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movement)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw failure;
        }
    }

    async update(id: string, view: InventoryView): Promise<void> {

        try {

            const movement = InventoryTransformer.toModel(view);
            const url = `${this.MOVEMENTS_API}/${id}`;
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movement)
            });

            if (response.status !== 200) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw failure;
        }
    }

    async delete(id: string): Promise<void> {

        try {

            const url = `${this.MOVEMENTS_API}/${id}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 204) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw failure;
        }
    }
    
    async addInitialMovement(view: InventoryView): Promise<void> {
    
        try {

            const movement = InventoryTransformer.toModel(view);

            const url = `${this.MOVEMENTS_API}/initial`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movement)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw failure;
        }
    }

    async searchInitialMovement(searchView: SearchWithDateRangeView): Promise<PagedView<InventoryView>> {

        try {

            const url = `${this.MOVEMENTS_API}/initial?initialDate=${searchView.initialDate}&finalDate=${searchView.finalDate}&page=${searchView.page}&size=${searchView.size}`;

            const response = await fetch(url);

            if (response.ok) {

                return await response.json();
            }

            const error = await response.json();
            throw error;

        } catch (failure: any) {

            console.log({failure})
            throw failure;
        }
    }
}