import { ProductCategoryCommon } from "./ProductCategoryCommon";
import { ResourceObject } from "./ResourceObject";

export class Product extends ResourceObject {

    code: string;
    type: string;
    name: string;
    description: string;
    minimalQuantity: number;
    active: string;
    category?: ProductCategoryCommon;
}
