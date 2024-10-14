import { Product } from "@/src/server/clients/domain/Product";
import { ErrorView } from "../domain/ErrorView";
import { PagedView } from "../domain/PagedView";
import { ProductView } from "../domain/ProductView";
import { SearchWithTypeView } from "../domain/SearchWithTypeView";

export class ProductService {

    private readonly PRODUCTS_API: string = '/api/products';

    async search(searchView: SearchWithTypeView): Promise<PagedView<ProductView>> {

        try {

            const url = `${this.PRODUCTS_API}?text=${searchView.text}&active=${searchView.active}&type=${searchView.type}&category=${searchView.category}&page=${searchView.page}&size=${searchView.size}`;

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

    async getById(id: string): Promise<ProductView> {

        try {

            const url = `${this.PRODUCTS_API}/${id}`;

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

    async add(view: ProductView): Promise<void> {

        try {

            const product: Product = {

                type: view.type,
                code: view.code,
                name: view.name,
                description: view.description,
                minimalQuantity: view.minimalQuantity,
                active: view.active,
                category: {
                    id: view.categoryId
                }
            };

            const response = await fetch(this.PRODUCTS_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async update(id: string, view: ProductView): Promise<void> {

        try {

            const url = `${this.PRODUCTS_API}/${id}`;

            const contact = {

                type: view.type,
                code: view.code,
                name: view.name,
                description: view.description,
                minimalQuantity: view.minimalQuantity,
                active: view.active,
                category: {
                    id: view.categoryId
                }
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
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