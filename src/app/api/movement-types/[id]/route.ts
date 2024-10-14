import { MovementTypeHandler } from "@/src/server/handlers/MovementTypeHandler";
import { requestWrapper } from "@/src/server/helpers/RequestHelper";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest,
                          { params }: { params: { id: string } }) {

    return requestWrapper(async () => {

        const { accessToken} = await getAccessToken(request, null);

        const handler: MovementTypeHandler = new MovementTypeHandler(accessToken);

        return await handler.getById(params.id);
    });
}

export async function PUT(request: NextRequest,
                          { params }: { params: { id: string } }) {

    return requestWrapper(async () => {

        const { accessToken} = await getAccessToken(request, null);
        const body = await request.json();

        const handler: MovementTypeHandler = new MovementTypeHandler(accessToken);

        return await handler.update(params.id, body);
    });
}
