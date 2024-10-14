import { InventoryHandler } from "@/src/server/handlers/InventoryHandler";
import { requestWrapper } from "@/src/server/helpers/RequestHelper";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest, 
                          { params }: { params: { id: string } }): Promise<NextResponse> {

    return await requestWrapper(async () => {

        const { accessToken } = await getAccessToken(request, null);
        const body = await request.json();

        const handler: InventoryHandler = new InventoryHandler(accessToken);
    
        return await handler.update(params.id, body);
    });
}

export async function DELETE(request: NextRequest, 
                             { params }: { params: { id: string } }): Promise<NextResponse> {

    return await requestWrapper(async () => {

        const { accessToken } = await getAccessToken(request, null);

        const handler: InventoryHandler = new InventoryHandler(accessToken);
    
        return await handler.delete(params.id);
    });
}