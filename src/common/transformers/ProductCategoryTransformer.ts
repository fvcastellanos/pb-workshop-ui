import { ProductCategory } from "@/src/server/clients/domain/ProductCategory";
import { BaseTransformer } from "./BaseTransformer";
import { CommonTransformer } from "./CommonTransformer";
import { ProductCategoryView } from "@/src/client/domain/ProductCategoryView";

export class ProductCategoryTransformer extends BaseTransformer {

    static toView(model: ProductCategory): ProductCategoryView {

        return {
            id: CommonTransformer.getId(model),
            name: model.name,
            description: model.description,
            code: model.code,
            active: model.active,
        }
    }

    static toModel(view: ProductCategoryView): ProductCategory {

        return {
            code: view.code,
            name: view.name,
            description: view.description,
            active: view.active
        }
    }
}