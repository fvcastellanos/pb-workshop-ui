import { ErrorView } from "@/src/client/domain/ErrorView";
import { FieldErrorView } from "@/src/client/domain/FieldErrorView";
import { ErrorResponse } from "@/src/server/domain/response/ErrorResponse";
import { FieldError } from "@/src/server/domain/response/FieldError";

export class ErrorTransformer {

    static toView(error: ErrorResponse): ErrorView {

        let errorView = ErrorView.buildEmptyErrorView();

        errorView.show = true;
        errorView.message = error.message;
        errorView.details = error.details;

        if (error.fieldErrors) {

            errorView.fieldErrors = error.fieldErrors.map((fieldError: FieldError) => {

                let fieldErrorView: FieldErrorView =
                {
                    error: fieldError.error,
                    fieldName: fieldError.fieldName,
                    fieldValue: fieldError.value
                };

                return fieldErrorView;
            });
        }

        return errorView;
    }

}