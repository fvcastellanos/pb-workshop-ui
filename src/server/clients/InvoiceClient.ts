import { BaseDetailClient } from "./BaseDetailClient";
import { Invoice } from "./domain/Invoice";
import { InvoiceDetail } from "./domain/InvoiceDetail";
import { SearchResponse } from "./domain/SearchResponse";
import { SearchWithStatusAndType } from "./domain/SearchWithStatusAndType";

export class InvoiceClient extends BaseDetailClient {

    private readonly RESOURCE = "/invoices";
    private readonly DETAILS_RESOURCE = "details";

    async search(search: SearchWithStatusAndType): Promise<SearchResponse<Invoice>> {

        return await this.performSearch(this.RESOURCE, search);
    }

    async add(invoice: object) : Promise<void> {

        await this.performAdd(this.RESOURCE, invoice);
    }

    async getById(id: string): Promise<Invoice> {

        const url = `${this.RESOURCE}/${id}`;
        return await this.performGetById(url);
    }

    async update(id: string, invoice: object): Promise<void> {

        const url = `${this.RESOURCE}/${id}`;
        await this.performUpdate(url, invoice);
    }        

    async getInvoiceDetails(id: string): Promise<InvoiceDetail[]> {

        const url = `${this.RESOURCE}/${id}/${this.DETAILS_RESOURCE}`;
        return await this.getDetails(url);
    }

    async addInvoiceDetail(id: string, invoiceDetail: InvoiceDetail): Promise<void> {

        const url = `${this.RESOURCE}/${id}/${this.DETAILS_RESOURCE}`;
        await this.performAdd(url, invoiceDetail);
    }

    async deleteInvoiceDetail(id: string, detailId: string): Promise<void> {

        const url = `${this.RESOURCE}/${id}/${this.DETAILS_RESOURCE}/${detailId}`;
        await this.delete(url);
    }

    async updateInvoiceDetail(id: string, detailId: string, invoiceDetail: InvoiceDetail): Promise<void> {

        const url = `${this.RESOURCE}/${id}/${this.DETAILS_RESOURCE}/${detailId}`;
        await this.performUpdate(url, invoiceDetail);
    }
}