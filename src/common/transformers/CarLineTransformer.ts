import { CarLineView } from "@/src/client/domain/CarLineView";
import { CarLine } from "@/src/server/clients/domain/CarLine";
import { BaseTransformer } from "./BaseTransformer";
import { CommonTransformer } from "./CommonTransformer";

export class CarLineTransformer extends BaseTransformer {

    static toView(carLine: CarLine): CarLineView {

        return {
            id: CommonTransformer.getId(carLine),
            name: carLine.name,
            description: carLine.description,
            active: carLine.active,
        };
    }

}