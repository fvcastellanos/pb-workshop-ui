import { ProductCategoryClient } from "../clients/ProductCategoryClient";
import { BaseHandler } from "./BaseHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { Search } from "../clients/domain/Search";
import { SearchResponse } from "../clients/domain/SearchResponse";
import { ProductCategory } from "../clients/domain/ProductCategory";
import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { ProductCategoryTransformer } from "@/src/common/transformers/ProductCategoryTransformer";

export class ProductCategoryHandler extends BaseHandler {

    private readonly client: ProductCategoryClient;

    constructor(accessToken: string) {

        super();
        this.client = new ProductCategoryClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {
    
            const text: string = this.getQueryParam(request.query.text);
            const active: number = this.getQueryParam(request.query.active);
            const page: string = this.getQueryParam(request.query.page);
            const size: string = this.getQueryParam(request.query.size);

            const search: Search = {
                text: text ? text : '',
                active: active ? active : 1,
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            };
    
            const searchResponse: SearchResponse<ProductCategory> = await this.client.search(search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(ProductCategoryTransformer.toView)
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
            const productCategory = await this.client.getById(id);
            const view = ProductCategoryTransformer.toView(productCategory);

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