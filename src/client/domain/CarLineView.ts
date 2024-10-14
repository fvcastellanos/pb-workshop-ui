import { CarBrandView } from "./CarBrandView";

export class CarLineView {

    id: string;
    name: string;
    description: string;
    active: string;
    carBrand?: CarBrandView;
}