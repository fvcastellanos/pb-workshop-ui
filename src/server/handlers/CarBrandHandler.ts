import { CarBrandTransformer } from "@/src/common/transformers/CarBrandTransformer";
import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { NextApiRequest, NextApiResponse } from "next";
import { CarBrandClient } from "../clients/CarBrandClient";
import { CarBrand } from "../clients/domain/CarBrand";
import { Search } from "../clients/domain/Search";
import { SearchResponse } from "../clients/domain/SearchResponse";
import { BaseHandler } from "./BaseHandler";

export class CarBrandHandler extends BaseHandler {
    
    private readonly client: CarBrandClient;

    constructor(accessToken: string) {

        super();
        this.client = new CarBrandClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {
    
            const name: string = this.getQueryParam(request.query.name);
            const active: number = this.getQueryParam(request.query.active);
            const page: string = this.getQueryParam(request.query.page);
            const size: string = this.getQueryParam(request.query.size);

            const search: Search = {
                name: name ? name : '',
                active: active ? active : 1,
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            };
    
            const searchResponse: SearchResponse<CarBrand> = await this.client.search(search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(CarBrandTransformer.toView)
            }
    
            response.status(200)
                .json(view);
        
        } catch (failure) {
    
            throw failure;
        }        
    }

    async getById(id: string, request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const carBrand = await this.client.getById(id);
            const view = CarBrandTransformer.toView(carBrand);

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

    async update(id: string, request: NextApiRequest, response: NextApiResponse): Promise<void> {
    
        try {
        
            await this.client.update(id, request.body);
    
            response.status(200)
                .end();
    
        } catch (failure) {
    
            throw failure;
        }
    }    
}