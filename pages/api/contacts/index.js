import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

import { ErrorResponse } from '@/src/server/domain/response/ErrorResponse';

import { ContactHandler } from '@/src/server/handlers/ContactHandler';

const handler = async (accessToken, request, response) => {

    const requestHandler = new ContactHandler(accessToken, request, response);

    switch (request.method) {

        case 'GET':
            await requestHandler.search(request, response);
        break;
        case 'POST':
            await requestHandler.add(request, response);
        break;
        default:
            response.status(405)
                .json(new ErrorResponse("Method not allowed"));
        break;
    }
}

export default withApiAuthRequired(async (request, response) => {

    try {

        const { accessToken } = await getAccessToken(request, response);

        return await handler(accessToken, request, response);

    } catch (failure) {

        response.status(failure.status || 500)
            .json(new ErrorResponse(failure.message));
    }
});
