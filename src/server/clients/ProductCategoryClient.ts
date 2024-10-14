import { BaseClient } from "./BaseClient";
import { ProductCategory } from "./domain/ProductCategory";
import { Search } from "./domain/Search";
import { SearchResponse } from "./domain/SearchResponse";

export class ProductCategoryClient extends BaseClient {

    private readonly RESOURCE = "/product-categories";

    async search(search: Search): Promise<SearchResponse<ProductCategory>> {

        return await this.performSearch(this.RESOURCE, search);
    }

    async getById(id: string): Promise<ProductCategory> {

        return await this.performGetById(`${this.RESOURCE}/${id}`);
    }

    async add(productCategory: object): Promise<void> {

        await this.performAdd(this.RESOURCE, productCategory);
    }

    async update(id: string, productCategory: object): Promise<void> {

        await this.performUpdate(`${this.RESOURCE}/${id}`, productCategory);
    }
}
