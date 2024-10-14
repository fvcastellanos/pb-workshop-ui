import { NextResponse } from "next/server";
import { ErrorTransformer } from "@/src/common/transformers/ErrorTransformer";

export async function requestWrapper(requestFunction): Promise<NextResponse>  {

    try {

        return await requestFunction();

    } catch (failure: any) {

        const httpStatus: number = failure.status || 500;
        const errorResponse = ErrorTransformer.toView(failure);

        return NextResponse.json(errorResponse, { status: httpStatus });
    }
}
