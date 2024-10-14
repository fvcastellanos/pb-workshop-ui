import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { WorkOrderDetailTransformer } from "@/src/common/transformers/WorkOrderDetailTransformer";
import { WorkOrderTransformer } from "@/src/common/transformers/WorkOrderTransformer";
import { NextApiRequest, NextApiResponse } from "next";
import { SearchResponse } from "../clients/domain/SearchResponse";
import { SearchWithStatus } from "../clients/domain/SearchWithStatus";
import { WorkOrder } from "../clients/domain/WorkOrder";
import { WorkOrderClient } from "../clients/WorkOrderClient";
import { BaseHandler } from "./BaseHandler";

export class WorkOrderHandler extends BaseHandler {

    private readonly client: WorkOrderClient;

    constructor(accessToken: string) {

        super();

        this.client = new WorkOrderClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {
    
            const text: string = this.getQueryParam(request.query.text);
            const status: string = this.getQueryParam(request.query.status);
            const active: number = this.getQueryParam(request.query.active);
            const page: string = this.getQueryParam(request.query.page);
            const size: string = this.getQueryParam(request.query.size);

            const search: SearchWithStatus = {
                text: text ? text : '',
                status: status ? status : '%',
                active: active ? active : 1,
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            };
    
            const searchResponse: SearchResponse<WorkOrder> = await this.client.search(search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(WorkOrderTransformer.toView)
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
            const view = WorkOrderTransformer.toView(product);

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
            const details = await this.client.getOrderDetails(id);

            const detailsView = details.map(WorkOrderDetailTransformer.toView);

            response.status(200)
                .json(detailsView);

        } catch (failure: any) {

            throw failure;
        }
    }

    async addDetail(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const id = request.query.id.toString();
            const orderDetail = WorkOrderDetailTransformer.toModel(id, request.body);

            await this.client.addOrderDetail(id, orderDetail);

            response.status(201)
                .end();

        } catch (failure: any) {

            throw failure;
        }
    }

    async deleteDetail(request: NextApiRequest, response: NextApiResponse): Promise<void> {

        try {

            const id = request.query.id.toString();
            const detailId = request.query.detailId.toString();

            await this.client.deleteOrderDetail(id, detailId);

            response.status(204)
                .end();

        } catch (failure: any) {

            throw failure;
        }
    }
}