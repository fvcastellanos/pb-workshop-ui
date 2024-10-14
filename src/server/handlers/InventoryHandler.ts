import { InventoryClient } from "../clients/InventoryClient";
import { BaseHandler } from "./BaseHandler";
import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { InventoryTransformer } from "@/src/common/transformers/InventoryTransformer";
import { NextRequest, NextResponse } from "next/server";

export class InventoryHandler extends BaseHandler {

    private readonly client: InventoryClient;

    constructor(accessToken: string) {

        super();
        this.client = new InventoryClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(request: NextRequest): Promise<NextResponse> {

        try {

            const type: string = this.getSearchParam('type', request);
            const text: string = this.getSearchParam('text', request);
            const initialDate: string = this.getSearchParam('initialDate', request);
            const finalDate: string = this.getSearchParam('finalDate', request);
            const page: string = this.getSearchParam('page', request);
            const size: string = this.getSearchParam('size', request);

            const search = {
    
                type: type ? type : '%',
                operationTypeCode: text ? text : '%',
                initialDate,
                finalDate,
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            }
    
            const searchResponse = await this.client.search(search);

            const view = {

                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(InventoryTransformer.toWeb)
            };

            return NextResponse.json(view, { status: 200 });

        } catch (failure) {

            throw failure;
        }
    }

    async add(movement: any): Promise<NextResponse> {

        return this.handleWrapper(async () => {

            await this.client.add(movement);

            return NextResponse
                .json(null, { status: 201 });
        });
    }

    async update(id: string, movement: any): Promise<NextResponse> {

        return this.handleWrapper(async () => {

            await this.client.update(id, movement);

            return NextResponse
                .json(null, { status: 200 });
        });
    }

    async delete(id: string): Promise<NextResponse> {

        return this.handleWrapper(async () => {

            await this.client.delete(id);

            return new NextResponse(null, { 
                status: 204
            });
        });
    }

    async addInitialMovement(movement: any): Promise<NextResponse> {

        return this.handleWrapper(async () => {

            const operationType = {
                code: process.env.INITIAL_MOVEMENT_TYPE_CODE,
            };

            movement.operationType = operationType;

            return await this.add(movement);
        });
    }

    async searchInitialMovements(request: NextRequest): Promise<NextResponse> {

        request.nextUrl.searchParams.set('text', process.env.INITIAL_MOVEMENT_TYPE_CODE);
        return await this.search(request);
    }
}