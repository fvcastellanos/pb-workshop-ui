import { ResourceObject } from "./ResourceObject";

export class Contact extends ResourceObject {

    name: string;
    type: string;
    code: string;
    contactName?: string;
    taxId?: string;
    description?:string;
    active: string;
}