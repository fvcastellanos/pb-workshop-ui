import { CarBrand } from "./CarBrand";
import { ResourceObject } from "./ResourceObject";

export class CarLine extends ResourceObject {

    name: string;
    description: string;
    active: string;
    carBrand: CarBrand;
}