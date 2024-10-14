import { NextRequest, NextResponse } from "next/server";
import { InventoryMovementTypeClient } from "../clients/InventoryMovementTypeClient";
import { BaseHandler } from "./BaseHandler";
import { SearchResponse } from "../clients/domain/SearchResponse";
import { InventoryMovementType } from "../clients/domain/InventoryMovementType";
import { CommonTransformer } from "@/src/common/transformers/CommonTransformer";
import { InventoryMovementTypeTransformer } from "@/src/common/transformers/InventoryMovementTypeTransformer";
import { SearchWithType } from "../clients/domain/SearchWithType";

export class MovementTypeHandler extends BaseHandler {

    private readonly client: InventoryMovementTypeClient;
    
    constructor(accessToken: string) {

        super();
        this.client = new InventoryMovementTypeClient(process.env.WORKSHOP_API_BASE_URL, accessToken);
    }

    async search(request: NextRequest): Promise<NextResponse> {

        try {
                
            const text: string = request.nextUrl.searchParams.get('text');
            const active: string = request.nextUrl.searchParams.get('active');
            const type: string = request.nextUrl.searchParams.get('type');
            const page: string = request.nextUrl.searchParams.get('page');
            const size: string = request.nextUrl.searchParams.get('size');

            const search: SearchWithType = {
                text: text ? text : '',
                active: active ? Number(active) : 1,
                type: type ? type : '',
                page: page ? Number(page) : this.DEFAULT_PAGE,
                size: size ? Number(size) : this.DEFAULT_SIZE
            };
    
            const searchResponse: SearchResponse<InventoryMovementType> = await this.client.search(search);
    
            const view = {
                pageable: CommonTransformer.buildPageable(searchResponse),
                content: searchResponse.content
                            .map(InventoryMovementTypeTransformer.toWeb)
            }
    
            return NextResponse.json(view, { status: 200 });
        
        } catch (failure) {
    
            throw failure;
        }        
    }

    async getById(id: string): Promise<NextResponse> {

        try {

            const type = await this.client.getById(id);
            const view = InventoryMovementTypeTransformer.toWeb(type);

            return NextResponse.json(view, { status: 200 });

        } catch (failure) {

            throw failure;
        }

    }

    async update(id: string, body: any): Promise<NextResponse> {

        try {

            await this.client.update(id, body);

            return NextResponse.json(null, 
                {
                    status: 200
                }
            );

        } catch (failure: any) {

            throw failure;
        }
    }

    async add(body: any): Promise<NextResponse> {

        try {

            await this.client.add(body);

            return NextResponse.json(null, 
                {
                    status: 201
                }
            );

        } catch (failure: any) {

            throw failure;
        }
    }
}