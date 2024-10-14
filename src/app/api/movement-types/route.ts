import { MovementTypeHandler } from "@/src/server/handlers/MovementTypeHandler";
import { requestWrapper } from "@/src/server/helpers/RequestHelper";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    return await requestWrapper(async () => {

        const { accessToken} = await getAccessToken(request, null);

        const handler: MovementTypeHandler = new MovementTypeHandler(accessToken);
    
        return await handler.search(request);    
    });
}

export async function POST(request: NextRequest) {

    return await requestWrapper(async () => {

        const { accessToken} = await getAccessToken(request, null);
        const body = await request.json();

        const handler: MovementTypeHandler = new MovementTypeHandler(accessToken);

        return await handler.add(body);
    });
}

