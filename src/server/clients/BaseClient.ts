import axios, { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "../domain/response/ErrorResponse";
import { FieldError } from "../domain/response/FieldError";

export abstract class BaseClient {

    protected readonly baseUrl: string;
    protected readonly accessToken: string;

    constructor(baseUrl: string, accessToken: string) {

        this.baseUrl = baseUrl;
        this.accessToken = accessToken;
    }

    protected async performSearch<T> (url: string, params: object): Promise<T> {

        try {

            const config = {
                params: params,
                ... this.buildRequestConfig(),
            };

            const response = await axios.get(url, config);
            return response.data;

        } catch (failure: any) {

            this.handleErrorResponse(failure);
        }
    }

    protected async performGetById<T>(url: string): Promise<T> {

        try {

            const response = await axios.get(url, this.buildRequestConfig());
            return response.data;

        } catch(failure: any) {

            this.handleErrorResponse(failure);
        }
    }

    protected async performAdd(url: string, data: object): Promise<void> {

        try {

            await axios.post(url, data, this.buildRequestConfig());

        } catch (failure: any) {

            this.handleErrorResponse(failure);
        }
    }

    protected async performUpdate(url: string, data: object): Promise<void> {

        try {

            await axios.put(url, data, this.buildRequestConfig());

        } catch (failure: any) {

            this.handleErrorResponse(failure);
        }
    }

    protected async performDelete(url: string): Promise<void> {

        try {

            await axios.delete(url, this.buildRequestConfig());
            
        } catch (failure: any) {

            this.handleErrorResponse(failure);
        }
    }

    // ------------------------------------------------------------------------------------

    protected buildRequestHeaders() {

        return {

            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        };    
    }

    protected buildRequestConfig() {

        return {
            baseURL: this.baseUrl,
            headers: this.buildRequestHeaders()
        };
    }

    // ------------------------------------------------------------------------------------

    private handleErrorResponse(failure: AxiosError) {

        const status = failure.response?.status || 500;

        if (failure.response) {

            const response: AxiosResponse = failure.response;

            if (response.status >= 400 && response.status < 500) {

                const data = response.data;

                const message = data.message? data.message : data.detail;

                const errors = data.errors ? data.errors : [];

                var fieldErrors = errors.map((error: any) => {

                    var fieldError = new FieldError();
                    fieldError.fieldName = error.fieldName;
                    fieldError.value = error.value;
                    fieldError.error = error.error;

                    return fieldError;
                });

                var errorResponse = ErrorResponse.withCodeAndMessage(status, failure.code, message);
                errorResponse.fieldErrors = fieldErrors;

                throw errorResponse;
            }

            throw ErrorResponse.withMessage(status, response.data.message);

        }

        if (failure.request) {

            throw ErrorResponse.withMessage(status, "No response from server");
        }

        throw ErrorResponse.withMessage(status, failure.message);
    }
}