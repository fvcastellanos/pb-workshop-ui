import { InvoiceTransformer } from "@/src/common/transformers/InvoiceTransformer";
import { ErrorView } from "../domain/ErrorView";
import { InvoiceView } from "../domain/InvoiceView";
import { PagedView } from "../domain/PagedView";
import { SearchWithStatusAndTypeView } from "../domain/SearchWithStatusAndTypeView";
import { InvoiceDetailView } from "../domain/InvoiceDetailView";


export class InvoiceService {

    private readonly INVOICES_API: string = '/api/invoices';
    private readonly INVOCES_DETAILS: string = 'details';

    async search(searchView: SearchWithStatusAndTypeView): Promise<PagedView<InvoiceView>> {

        try {

            const url = `${this.INVOICES_API}?text=${searchView.text}&status=${searchView.status}&type=${searchView.type}&page=${searchView.page}&size=${searchView.size}`;

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

    async getById(id: string): Promise<InvoiceView> {

        try {

            const url = `${this.INVOICES_API}/${id}`;

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

    async add(view: InvoiceView): Promise<void> {

        try {

            const invoice = InvoiceTransformer.toModel(view);

            const response = await fetch(this.INVOICES_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoice)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async update(id: string, view: InvoiceView): Promise<void> {

        try {

            const url = `${this.INVOICES_API}/${id}`;

            const invoice = InvoiceTransformer.toModel(view);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoice)
            });

            if (!response.ok) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }        

    async getDetails(id: string): Promise<InvoiceDetailView[]> {

        try {

            const url = `${this.INVOICES_API}/${id}/${this.INVOCES_DETAILS}`;

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

    async addDetail(id: string, view: InvoiceDetailView): Promise<void> {

        try {

            const url = `${this.INVOICES_API}/${id}/${this.INVOCES_DETAILS}`;

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

            const url = `${this.INVOICES_API}/${id}/${this.INVOCES_DETAILS}/${detailId}`;

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

    async updateDetail(id: string, detailId: string, view: InvoiceDetailView): Promise<void> {

        try {

            const url = `${this.INVOICES_API}/${id}/${this.INVOCES_DETAILS}/${detailId}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(view)
            });

            if (response.status !== 200) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }        
    }
}