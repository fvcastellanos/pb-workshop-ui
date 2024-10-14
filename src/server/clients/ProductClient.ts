import { BaseClient } from "./BaseClient";
import { SearchWithType } from "./domain/SearchWithType";
import { Product } from "./domain/Product";
import { SearchResponse } from "./domain/SearchResponse";

export class ProductClient extends BaseClient {

    private readonly RESOURCE = "/products";

    async search(search: SearchWithType): Promise<SearchResponse<Product>> {

        return await this.performSearch(this.RESOURCE, search);
    }

    async add(contact: object) : Promise<void> {

        await this.performAdd(this.RESOURCE, contact);
    }

    async getById(id: string): Promise<Product> {

        const url = `${this.RESOURCE}/${id}`;
        return await this.performGetById(url);
    }

    async update(id: string, contact: object): Promise<void> {

        const url = `${this.RESOURCE}/${id}`;
        await this.performUpdate(url, contact);
    }    
}