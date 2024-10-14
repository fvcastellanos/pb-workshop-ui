import { CarBrandTransformer } from "@/src/common/transformers/CarBrandTransformer";
import { CarLineTransformer } from "@/src/common/transformers/CarLineTransformer";
import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { NextApiRequest, NextApiResponse } from "next";
import { CarLineClient } from "../clients/CarLineClient";
import { CarBrand } from "../clients/domain/CarBrand";
import { CarLine } from "../clients/domain/CarLine";
import { Search } from "../clients/domain/Search";
import { SearchResponse } from "../clients/domain/SearchResponse";
import { BaseHandler } from "./BaseHandler";

export class CarLineHandler extends BaseHandler {

    private readonly client: CarLineClient;

    private readonly request: NextApiRequest;
    private readonly response: NextApiResponse    

    constructor(accessToken: string, request: NextApiRequest, response: NextApiResponse) {

        super();

        this.request = request;
        this.response = response;

        this.client = new CarLineClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(carBrandId: string): Promise<void> {

        try {
    
            const name: string = this.getQueryParam(this.request.query.name);
            const active: number = this.getQueryParam(this.request.query.active);
            const page: string = this.getQueryParam(this.request.query.page);
            const size: string = this.getQueryParam(this.request.query.size);

            const search: Search = {
                name: name ? name : '',
                active: active ? active : 1,
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            };
    
            const searchResponse: SearchResponse<CarLine> = await this.client.search(carBrandId, search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(CarLineTransformer.toView)
            }
    
            this.response.status(200)
                .json(view);
        
        } catch (failure) {
    
            throw failure;
        }        
    }

    async getById(carBrandId: string, id: string, request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const carLine = await this.client.getById(carBrandId, id);
            const view = CarLineTransformer.toView(carLine);

            response.status(200)
                .json(view);

        } catch (failure) {

            throw failure;
        }
    }

    async add(carBrandId: string, request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            await this.client.add(carBrandId, request.body);

            response.status(201)
                .end();

        } catch (failure) {

            throw failure;
        }
    }

    async update(carBrandId: string, id: string, request: NextApiRequest, response: NextApiResponse): Promise<void> {
    
        try {
        
            await this.client.update(carBrandId, id, request.body);
    
            response.status(200)
                .end();
    
        } catch (failure) {
    
            throw failure;
        }
    }        

    async searchLines(request: NextApiRequest, response: NextApiResponse): Promise<void> {

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
    
            const searchResponse: SearchResponse<CarLine> = await this.client.searchLines(search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(CarLineTransformer.toView)
            }
    
            response.status(200)
                .json(view);
        
        } catch (failure) {
    
            throw failure;
        }        
    }
}