import { BaseClient } from "./BaseClient";
import { Inventory } from "./domain/Inventory";
import { SearchResponse } from "./domain/SearchResponse";
import { SearchWithDateRange } from "./domain/SearchWithDateRange";

export class InventoryClient extends BaseClient {

    private readonly RESOURCE = "/inventory-movements";

    async search(search: SearchWithDateRange): Promise<SearchResponse<Inventory>> {

        return await this.performSearch(this.RESOURCE, search);
    }

    async add(movement: object) : Promise<void> {

        await this.performAdd(this.RESOURCE, movement);
    }

    async getById(id: string): Promise<Inventory> {

        const url = `${this.RESOURCE}/${id}`;
        return await this.performGetById(url);
    }

    async update(id: string, contact: object): Promise<void> {

        const url = `${this.RESOURCE}/${id}`;
        await this.performUpdate(url, contact);
    }

    async delete(id: string): Promise<void> {

        const url = `${this.RESOURCE}/${id}`;
        await this.performDelete(url);
    }

}