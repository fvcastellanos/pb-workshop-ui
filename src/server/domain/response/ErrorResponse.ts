import { FieldError } from "./FieldError";

export class ErrorResponse {

    status: number;
    code: string;
    title: string;
    message: string;
    details: string[];
    fieldErrors?: FieldError[];

    static withMessage(status: number, message: string): ErrorResponse {

        return {
            status,
            code: '',
            title: '',
            details: [],
            message,
        };
    }

    static withCodeAndMessage(status: number, code: string, message: string): ErrorResponse {

        return {
            status,
            code,
            title: '',
            details: [],
            message,
        };
    }

    static withCodeTitleAndMessage(status: number, code: string, title: string, message: string): ErrorResponse {

        return {
            status,
            code,
            title,
            details: [],
            message,
        };
    }

}