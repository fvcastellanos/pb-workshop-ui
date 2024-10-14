import { WorkOrderTransformer } from "@/src/common/transformers/WorkOrderTransformer";
import { WorkOrder } from "@/src/server/clients/domain/WorkOrder";
import { ErrorView } from "../domain/ErrorView";
import { PagedView } from "../domain/PagedView";
import { SearchWithStatusView } from "../domain/SearchWithStatusView";
import { WorkOrderDetailView } from "../domain/WorkOrderDetailView";
import { WorkOrderView } from "../domain/WorkOrderView";

export class WorkOrderService {

    private readonly WORK_ORDERS_API: string = '/api/work-orders';
    private readonly WORK_ORDERS_DETAILS: string = '/details';

    async search(searchView: SearchWithStatusView): Promise<PagedView<WorkOrderView>> {

        try {

            const url = `${this.WORK_ORDERS_API}?text=${searchView.text}&active=${searchView.active}&status=${searchView.status}&page=${searchView.page}&size=${searchView.size}`;

            const response = await fetch(url);

            if (response.ok) {

                return await response.json();
            }

            const error = await response.json();
            throw error;

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async getById(id: string): Promise<WorkOrderView> {

        try {

            const url = `${this.WORK_ORDERS_API}/${id}`;

            const response = await fetch(url);

            if (response.ok) {

                return await response.json();
            }

            const error = await response.json();
            throw error;

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async add(view: WorkOrderView): Promise<void> {

        try {

            const workOrder: WorkOrder = WorkOrderTransformer.toModel(view);

            const response = await fetch(this.WORK_ORDERS_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workOrder)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async update(id: string, view: WorkOrderView): Promise<void> {

        try {

            const url = `${this.WORK_ORDERS_API}/${id}`;

            const workOrder: WorkOrder = WorkOrderTransformer.toModel(view);


            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workOrder)
            });

            if (!response.ok) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }       
    
    async getDetails(id: string): Promise<WorkOrderDetailView[]> {

        try {

            const url = `${this.WORK_ORDERS_API}/${id}/${this.WORK_ORDERS_DETAILS}`;

            const response = await fetch(url);

            if (response.ok) {

                return await response.json();
            }

            const error = await response.json();
            throw error;

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async addDetail(id: string, view: WorkOrderDetailView): Promise<void> {

        try {

            const url = `${this.WORK_ORDERS_API}/${id}/${this.WORK_ORDERS_DETAILS}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(view)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }


        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async deleteDetail(id: string, detailId: string): Promise<void> {

        try {

            const url = `${this.WORK_ORDERS_API}/${id}/${this.WORK_ORDERS_DETAILS}/${detailId}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 204) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

}