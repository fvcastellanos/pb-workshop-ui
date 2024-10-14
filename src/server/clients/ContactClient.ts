import { BaseClient } from "./BaseClient";
import { Contact } from "./domain/Contact";
import { SearchResponse } from "./domain/SearchResponse";
import { SearchWithType } from "./domain/SearchWithType";

export class ContactClient extends BaseClient {

    private readonly RESOURCE = "/contacts";

    async search(search: SearchWithType): Promise<SearchResponse<Contact>> {

        return await this.performSearch(this.RESOURCE, search);
    }

    async add(contact: object) : Promise<void> {

        await this.performAdd(this.RESOURCE, contact);
    }

    async getById(id: string): Promise<Contact> {

        const url = `${this.RESOURCE}/${id}`;
        return await this.performGetById(url);
    }

    async update(id: string, contact: object): Promise<void> {

        const url = `${this.RESOURCE}/${id}`;
        await this.performUpdate(url, contact);
    }
}