import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { ContactTransformer } from "@/src/common/transformers/ContactTransformer";
import { NextApiRequest, NextApiResponse } from "next";
import { ContactClient } from "../clients/ContactClient";
import { Contact } from "../clients/domain/Contact";
import { SearchResponse } from "../clients/domain/SearchResponse";
import { SearchWithType } from "../clients/domain/SearchWithType";
import { BaseHandler } from "./BaseHandler";

export class ContactHandler extends BaseHandler {

    private readonly client: ContactClient;

    private readonly request: NextApiRequest;
    private readonly response: NextApiResponse    

    constructor(accessToken: string, request: NextApiRequest, response: NextApiResponse) {

        super();

        this.request = request;
        this.response = response;

        this.client = new ContactClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {
    
            const text: string = this.getQueryParam(request.query.text);
            const type: string = this.getQueryParam(request.query.type);
            const active: number = this.getQueryParam(request.query.active);
            const page: string = this.getQueryParam(request.query.page);
            const size: string = this.getQueryParam(request.query.size);

            const search: SearchWithType = {
                text: text ? text : '',
                type: type ? type : '%',
                active: active ? active : 1,
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            };
    
            const searchResponse: SearchResponse<Contact> = await this.client.search(search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(ContactTransformer.toView)
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
            const contact = await this.client.getById(id);
            const view = ContactTransformer.toView(contact);

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
}