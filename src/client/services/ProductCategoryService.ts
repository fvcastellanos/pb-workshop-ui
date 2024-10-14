import { ProductCategory } from "@/src/server/clients/domain/ProductCategory";
import { ErrorView } from "../domain/ErrorView";
import { PagedView } from "../domain/PagedView";
import { ProductCategoryView } from "../domain/ProductCategoryView";
import { SearchView } from "../domain/SearchView";
import { ProductCategoryTransformer } from "@/src/common/transformers/ProductCategoryTransformer";

export class ProductCategoryService {

    private readonly API_RESOURCE: string = '/api/product-categories';

    async search(searchView: SearchView): Promise<PagedView<ProductCategoryView>> {

        try {

            const url = `${this.API_RESOURCE}?text=${searchView.text}&active=${searchView.active}&page=${searchView.page}&size=${searchView.size}`;

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

    async getById(id: string): Promise<ProductCategoryView> {

        try {

            const url = `${this.API_RESOURCE}/${id}`;

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

    async add(view: ProductCategoryView): Promise<void> {

        try {

            const productCategory: ProductCategory = ProductCategoryTransformer.toModel(view);

            const response = await fetch(this.API_RESOURCE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productCategory)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async update(id: string, view: ProductCategoryView): Promise<void> {

        try {

            const url = `${this.API_RESOURCE}/${id}`;

            const productCategory: ProductCategory = ProductCategoryTransformer.toModel(view);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productCategory)
            });

            if (!response.ok) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }        

}