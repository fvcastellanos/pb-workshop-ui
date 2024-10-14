import { CarBrand } from "@/src/server/clients/domain/CarBrand";
import { CarBrandView } from "../domain/CarBrandView";
import { ErrorView } from "../domain/ErrorView";
import { PagedView } from "../domain/PagedView";
import { SearchView } from "../domain/SearchView";

export class CarBrandService {

    private readonly CAR_BRANDS_API: string = '/api/car-brands';

    async search(searchView: SearchView): Promise<PagedView<CarBrandView>> {

        try {

            const url = `${this.CAR_BRANDS_API}?name=${searchView.text}&active=${searchView.active}&page=${searchView.page}&size=${searchView.size}`;

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

    async getById(id: string): Promise<CarBrandView> {

        try {

            const url = `${this.CAR_BRANDS_API}/${id}`;

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

    async add(view: CarBrandView): Promise<void> {

        try {

            const carBrand: CarBrand = {

                name: view.name,
                description: view.description,
                active: view.active
            };

            const response = await fetch(this.CAR_BRANDS_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carBrand)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async update(id: string, view: CarBrandView): Promise<void> {

        try {

            const url = `${this.CAR_BRANDS_API}/${id}`;

            const carBrand = {

                name: view.name,
                description: view.description,
                active: view.active
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carBrand)
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