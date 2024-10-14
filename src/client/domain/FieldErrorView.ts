
export class FieldErrorView {

    error: string;
    fieldName: string;
    fieldValue: string;

    constructor(error: string, fieldName: string, fieldValue: string) {
        this.error = error;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}