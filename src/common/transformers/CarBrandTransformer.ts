import { CarBrandView } from "@/src/client/domain/CarBrandView";
import { CarBrand } from "@/src/server/clients/domain/CarBrand";
import { CommonTransformer } from "./CommonTransformer";

export class CarBrandTransformer {

    static toView(carBrand: CarBrand): CarBrandView {

        return {
            id: CommonTransformer.getId(carBrand),
            name: carBrand.name,
            description: carBrand.description,
            active: carBrand.active
        };
    }

}