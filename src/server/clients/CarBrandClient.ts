import { BaseClient } from "./BaseClient";
import { CarBrand } from "./domain/CarBrand";
import { Search } from "./domain/Search";
import { SearchResponse } from "./domain/SearchResponse";

export class CarBrandClient extends BaseClient {

    private readonly RESOURCE = "/car-brands";

    constructor(baseApiUrl: string, accessToken: string) {

        super(baseApiUrl, accessToken);
    }

    async search(search: Search): Promise<SearchResponse<CarBrand>> {

        return await this.performSearch(this.RESOURCE, search);
    }

    async add(carBrand) : Promise<void> {

        await this.performAdd(this.RESOURCE, carBrand);
    }

    async getById(id: string): Promise<CarBrand> {

        const url = `${this.RESOURCE}/${id}`;
        return await this.performGetById(url);
    }

    async update(id: string, carBrand: object): Promise<void> {

        const url = `${this.RESOURCE}/${id}`;
        await this.performUpdate(url, carBrand);
    }
}