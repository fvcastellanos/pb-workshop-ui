import axios from "axios";
import { ErrorResponse } from "./domain/ErrorResponse";
import { SearchResponse } from "./domain/SearchResponse";
import { SearchWithStatus } from "./domain/SearchWithStatus";
import { WorkOrder } from "./domain/WorkOrder";
import { WorkOrderDetail } from "./domain/WorOrderDetail";
import { BaseDetailClient } from "./BaseDetailClient";

export class WorkOrderClient extends BaseDetailClient {

    private readonly RESOURCE = "/work-orders";

    async search(search: SearchWithStatus): Promise<SearchResponse<WorkOrder>> {

        return await this.performSearch(this.RESOURCE, search);
    }

    async add(workOrder: object) : Promise<void> {

        await this.performAdd(this.RESOURCE, workOrder);
    }

    async getById(id: string): Promise<WorkOrder> {

        const url = `${this.RESOURCE}/${id}`;
        return await this.performGetById(url);
    }

    async update(id: string, workOrder: object): Promise<void> {

        const url = `${this.RESOURCE}/${id}`;
        await this.performUpdate(url, workOrder);
    }    

    async getOrderDetails(id: string): Promise<WorkOrderDetail[]> {

        const url = `${this.RESOURCE}/${id}/details`;
        return await this.getDetails(url);
    }

    async addOrderDetail(id: string, workOrderDetail: WorkOrderDetail): Promise<void> {

        const url = `${this.RESOURCE}/${id}/details`;
        await this.performAdd(url, workOrderDetail);
    }

    async deleteOrderDetail(id: string, detailId: string): Promise<void> {

        const url = `${this.RESOURCE}/${id}/details/${detailId}`;
        await this.delete(url);
    }

}