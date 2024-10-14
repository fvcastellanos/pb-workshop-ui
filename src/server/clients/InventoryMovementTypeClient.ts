import { BaseClient } from "./BaseClient";
import { InventoryMovementType } from "./domain/InventoryMovementType";
import { Search } from "./domain/Search";
import { SearchResponse } from "./domain/SearchResponse";

export class InventoryMovementTypeClient extends BaseClient {

    private readonly RESOURCE = "/inventory-movement-types";

    async search(search: Search): Promise<SearchResponse<InventoryMovementType>> {

        return await this.performSearch(this.RESOURCE, search);
    }

    async add(movementType: object) : Promise<void> {

        await this.performAdd(this.RESOURCE, movementType);
    }

    async getById(id: string): Promise<InventoryMovementType> {

        const url = `${this.RESOURCE}/${id}`;
        return await this.performGetById(url);
    }

    async update(id: string, movementType: object): Promise<void> {

        const url = `${this.RESOURCE}/${id}`;
        await this.performUpdate(url, movementType);
    }

}