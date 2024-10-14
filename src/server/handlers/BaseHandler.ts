import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "../domain/response/ErrorResponse";

type RequestHandler = () => Promise<NextResponse<any>>; 

export abstract class BaseHandler {

    protected readonly DEFAULT_PAGE: number = 0;
    protected readonly DEFAULT_SIZE: number = 20;


    protected getQueryParam(queryParam: any) {

        return Array.isArray(queryParam) ? queryParam[0] : queryParam;
    }

    protected getSearchParam(name: string, request: NextRequest) {

        return request.nextUrl.searchParams.get(name);
    }

    protected async handleWrapper(handler: RequestHandler): Promise<NextResponse<any>> {
            
        try {

            return await handler();

        } catch (failure: any) {

            const httpStatus: number = failure.status || 500;
            const code: string = failure.code || 'INTERNAL_SERVER_ERROR';
            const title: string = failure.title || 'Unable to process request'
            const message: string = failure.message || 'Internal Server Error';
            const details: string[] = failure.details || [];
            const fieldErrors = failure.fieldErrors || [];
    
            const errorResponse = ErrorResponse.withCodeTitleAndMessage(httpStatus, code, title, message);
            errorResponse.details = details;
            errorResponse.fieldErrors = fieldErrors;    

            throw errorResponse;
        }
    }
}
