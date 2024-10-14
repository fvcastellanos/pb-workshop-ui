import { FieldErrorView } from "./FieldErrorView";

export class ErrorView {

    show: boolean;
    message: string;
    details?: string[] = [];
    fieldErrors?: FieldErrorView[] = [];

    constructor(show: boolean, message: string) {

        this.show = show;
        this.message = message;
    }

    static buildEmptyErrorView(): ErrorView {

        return new ErrorView(false, '');
    }

    static buildErrorView(message: string): ErrorView {

        return new ErrorView(true, message);
    }

    static buildErrorViewWithDetail(message: string, details: string[]): ErrorView {

        const errorView = new ErrorView(true, message);
        errorView.details = details;

        return errorView;
    }

    static buildErrorViewWithFieldErrors(message: string, fieldErrors: FieldErrorView[]): ErrorView {
            
        const errorView = new ErrorView(true, message);
        errorView.fieldErrors = fieldErrors;

        return errorView;
    }
}
