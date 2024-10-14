import axios from "axios";
import { BaseClient } from "./BaseClient";
import { ErrorResponse } from "./domain/ErrorResponse";

export abstract class BaseDetailClient extends BaseClient {

    protected async getDetails<T>(url: string): Promise<T> {

        try {

            const response = await axios.get(url, this.buildRequestConfig());
            return response.data;

        } catch (failure: any) {

            throw new ErrorResponse(failure.response.data?failure.response.data.message:failure.message);
        }
    }

    protected async delete(url: string): Promise<void> {

        try {

            const config = this.buildRequestConfig();

            await axios.delete(url, config);

        } catch (failure) {

            throw new ErrorResponse(failure.response.data?failure.response.data.message:failure.message);
        }
    }
}