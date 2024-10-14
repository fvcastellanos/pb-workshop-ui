import { CarLine } from "@/src/server/clients/domain/CarLine";
import { CarLineView } from "../domain/CarLineView";
import { ErrorView } from "../domain/ErrorView";
import { PagedView } from "../domain/PagedView";
import { SearchView } from "../domain/SearchView";

export class CarLineService {

    private readonly CAR_BRANDS_API: string = '/api/car-brands';

    async search(carBrandId: string, query: SearchView): Promise<PagedView<CarLineView>> {

        try {

            const url = `${this.CAR_BRANDS_API}/${carBrandId}/lines?name=${query.text}&active=${query.active}&page=${query.page}&size=${query.size}`;

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

    async searchLines(query: SearchView): Promise<PagedView<CarLineView>> {

        try {

            const url = `${this.CAR_BRANDS_API}/lines/search?text=${query.text}&active=${query.active}&page=${query.page}&size=${query.size}`;

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

    async getById(carBrandId: string, id: string): Promise<CarLineView> {

        try {

            const url = `${this.CAR_BRANDS_API}/${carBrandId}/lines/${id}`;

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

    async add(carBrandId: string, view: CarLineView): Promise<void> {

        try {

            const url = `${this.CAR_BRANDS_API}/${carBrandId}/lines`;

            const carLine: CarLine = {

                carBrand: view.carBrand,
                name: view.name,
                description: view.description,
                active: view.active
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carLine)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async update(carBrandId: string, id: string, view: CarLineView): Promise<void> {

        try {

            const url = `${this.CAR_BRANDS_API}/${carBrandId}/lines/${id}`;

            const carLine = {

                name: view.name,
                description: view.description,
                active: view.active
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carLine)
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