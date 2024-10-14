import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { ErrorResponse } from '@/src/server/domain/response/ErrorResponse';
import { CarLineHandler } from '@/src/server/handlers/CarLineHandler';

const handler = async (request, response) => {

    const { accessToken } = await getAccessToken(request, response);
    const requestHandler = new CarLineHandler(accessToken, request, response);
    const id = request.query.id;

    switch (request.method) {

        case 'GET':
            await requestHandler.search(id, request, response);
        break;

        case 'POST':
            await requestHandler.add(id, request, response);
        break;

        default:
            response.status(405)
                .json(new ErrorResponse("Method not allowed"));
        break;
    }
}

export default withApiAuthRequired(async (request, response) => {

    try {

        return await handler(request, response);

    } catch (failure) {

        response.status(failure.status || 500)
            .json(new ErrorResponse(failure.message));
    }
});
