import { BaseClient } from "./BaseClient";
import { CarLine } from "./domain/CarLine";
import { Search } from "./domain/Search";
import { SearchResponse } from "./domain/SearchResponse";

export class CarLineClient extends BaseClient {

    private readonly RESOURCE = "/car-brands/:id/lines";

    constructor(baseApiUrl: string, accessToken: string) {

        super(baseApiUrl, accessToken);
    }

    async search(carBrandId: string, query: Search): Promise<SearchResponse<CarLine>> {

        const url = this.RESOURCE.replace(":id", carBrandId);
        return await this.performSearch(url, query);
    }

    async searchLines(query: Search): Promise<SearchResponse<CarLine>> {

        const url = "/car-brands/lines/search";
        return await this.performSearch(url, query);
    }

    async getById(carBrandId: string, id: string): Promise<CarLine> {

        const url = `${this.RESOURCE.replace(":id", carBrandId)}/${id}`;
        return await this.performGetById(url);
    }

    async add(carBrandId: string, carLine: object): Promise<void> {

        const url = this.RESOURCE.replace(":id", carBrandId);
        await this.performAdd(url, carLine);
    }

    async update(carBrandId: string, id: string, carLine: object) {

        const url = `${this.RESOURCE.replace(":id", carBrandId)}/${id}`;
        await this.performUpdate(url, carLine);
    }
}