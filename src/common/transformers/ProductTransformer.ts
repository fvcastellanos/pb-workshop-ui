import { ProductView } from "@/src/client/domain/ProductView";
import { Product } from "@/src/server/clients/domain/Product";
import { BaseTransformer } from "./BaseTransformer";
import { CommonTransformer } from "./CommonTransformer";

export class ProductTransformer extends BaseTransformer {

    static toView(product: Product): ProductView {

        return {
            id: CommonTransformer.getId(product),
            type: product.type,
            code: product.code,
            name: product.name,
            description: product.description,
            minimalQuantity: product.minimalQuantity,
            active: product.active,
            categoryId: product.category? product.category.id : null,
            categoryName: product.category? product.category.name : null
        }
    }

    static toModel(view: ProductView): Product {

        return {
            code: view.code,
            type: view.type,
            name: view.name,
            description: view.description,
            minimalQuantity: view.minimalQuantity,
            active: view.active,
            category: {
                id: view.categoryId,
                name: view.categoryName
            }
        }
    }
}