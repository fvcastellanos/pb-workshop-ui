import { NextApiRequest, NextApiResponse } from "next";
import { InvoiceClient } from "../clients/InvoiceClient";
import { BaseHandler } from "./BaseHandler";
import { SearchWithStatusAndType } from "../clients/domain/SearchWithStatusAndType";
import { SearchResponse } from "../clients/domain/SearchResponse";
import { Invoice } from "../clients/domain/Invoice";
import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { InvoiceTransformer } from "@/src/common/transformers/InvoiceTransformer";
import { InvoiceDetailTransformer } from "@/src/common/transformers/InvoiceDetailTransformer";
import { NextRequest, NextResponse } from "next/server";

export class InvoiceHandler extends BaseHandler {

    private readonly client: InvoiceClient;

    constructor(accessToken: string) {

        super();
        this.client = new InvoiceClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {
    
            const text: string = this.getQueryParam(request.query.text);
            const type: string = this.getQueryParam(request.query.type);
            const status: string = this.getQueryParam(request.query.status);
            const page: string = this.getQueryParam(request.query.page);
            const size: string = this.getQueryParam(request.query.size);

            const search: SearchWithStatusAndType = {
                text: text ? text : '',
                type: type ? type : '%',
                status: status ? status : "A",
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            };
    
            const searchResponse: SearchResponse<Invoice> = await this.client.search(search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(InvoiceTransformer.toView)
            }
    
            response.status(200)
                .json(view);
        
        } catch (failure) {
    
            throw failure;
        }        
    }

    async getById(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const id = request.query.id.toString();
            const invoice = await this.client.getById(id);
            const view = InvoiceTransformer.toView(invoice);

            response.status(200)
                .json(view);

        } catch (failure) {

            throw failure;
        }
    }

    async add(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            await this.client.add(request.body);

            response.status(201)
                .end();

        } catch (failure) {

            throw failure;
        }
    }

    async update(request: NextApiRequest, response: NextApiResponse): Promise<void> {
    
        try {
        
            const id = request.query.id.toString();
            await this.client.update(id, request.body);
    
            response.status(200)
                .end();
    
        } catch (failure) {
    
            throw failure;
        }
    }        

    async getDetails(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const id = request.query.id.toString();
            const details = await this.client.getInvoiceDetails(id);

            const detailsView = details.map(InvoiceDetailTransformer.toWeb);

            response.status(200)
                .json(detailsView);

        } catch (failure: any) {

            throw failure;
        }
    }

    async addDetail(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const id = request.query.id.toString();
            const invoiceDetail = InvoiceDetailTransformer.toModel(id, request.body);

            await this.client.addInvoiceDetail(id, invoiceDetail);

            response.status(201)
                .end();

        } catch (failure: any) {

            throw failure;
        }
    }

    async deleteDetail(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const id = request.query.id.toString();
            const invoiceDetail = request.query.detailId.toString();

            await this.client.deleteInvoiceDetail(id, invoiceDetail);

            response.status(204)
                .end();

        } catch (failure: any) {

            throw failure;
        }
    }

    async updateDetail(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const id = request.query.id.toString();
            const invoiceDetailId = request.query.detailId.toString();
            const invoiceDetail = InvoiceDetailTransformer.toModel(id, request.body);

            await this.client.updateInvoiceDetail(id, invoiceDetailId, invoiceDetail);

            response.status(200)
                .end();
        } catch (failure: any) {

            throw failure;
        }
    }
}