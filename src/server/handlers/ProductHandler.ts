import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { ProductTransformer } from "@/src/common/transformers/ProductTransformer";
import { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../clients/domain/Product";
import { SearchResponse } from "../clients/domain/SearchResponse";
import { SearchWithType } from "../clients/domain/SearchWithType";
import { ProductClient } from "../clients/ProductClient";
import { BaseHandler } from "./BaseHandler";

export class ProductHandler extends BaseHandler {

    private readonly client: ProductClient;

    constructor(accessToken: string) {

        super();
        this.client = new ProductClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {
    
            const text: string = this.getQueryParam(request.query.text);
            const type: string = this.getQueryParam(request.query.type);
            const active: number = this.getQueryParam(request.query.active);
            const category: string = this.getQueryParam(request.query.category)
            const page: string = this.getQueryParam(request.query.page);
            const size: string = this.getQueryParam(request.query.size);

            const search: SearchWithType = {
                text: text ? text : '',
                type: type ? type : '%',
                category: category ? category: '%',
                active: active ? active : 1,
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            };
    
            const searchResponse: SearchResponse<Product> = await this.client.search(search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(ProductTransformer.toView)
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
            const product = await this.client.getById(id);
            const view = ProductTransformer.toView(product);

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