import { ContactView } from "@/src/client/domain/ContactView";
import { Contact } from "@/src/server/clients/domain/Contact";
import { BaseTransformer } from "./BaseTransformer";
import { CommonTransformer } from "./CommonTransformer";

export class ContactTransformer extends BaseTransformer {

    static toView(contact: Contact): ContactView {

        return {
            id: CommonTransformer.getId(contact),
            type: contact.type,
            code: contact.code,
            name: contact.name,
            description: contact.description,
            contact: contact.contactName,
            taxId: contact.taxId,
            active: contact.active
        }
    }

    toModel(view: ContactView): Contact {

        return {
            code: view.code,
            type: view.type,
            name: view.name,
            description: view.description,
            contactName: view.contact,
            taxId: view.taxId,
            active: view.active,
        }
    }
}