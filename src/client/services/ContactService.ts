import { Contact } from "@/src/server/clients/domain/Contact";
import { ContactView } from "../domain/ContactView";
import { ErrorView } from "../domain/ErrorView";
import { PagedView } from "../domain/PagedView";
import { SearchWithTypeView } from "../domain/SearchWithTypeView";

export class ContactService {

    private readonly CONTACTS_API: string = '/api/contacts';

    async search(searchView: SearchWithTypeView): Promise<PagedView<ContactView>> {

        try {

            const url = `${this.CONTACTS_API}?text=${searchView.text}&active=${searchView.active}&type=${searchView.type}&page=${searchView.page}&size=${searchView.size}`;

            const response = await fetch(url);

            if (response.ok) {

                return await response.json();
            }

            const error = await response.json();
            throw error;

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async getById(id: string): Promise<ContactView> {

        try {

            const url = `${this.CONTACTS_API}/${id}`;

            const response = await fetch(url);

            if (response.ok) {

                return await response.json();
            }

            const error = await response.json();
            throw error;

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async add(view: ContactView): Promise<void> {

        try {

            const contact: Contact = {

                type: view.type,
                code: view.code,
                taxId: view.taxId,
                name: view.name,
                description: view.description,
                active: view.active
            };

            const response = await fetch(this.CONTACTS_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
            });

            if (response.status !== 201) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }

    async update(id: string, view: ContactView): Promise<void> {

        try {

            const url = `${this.CONTACTS_API}/${id}`;

            const contact = {

                type: view.type,
                code: view.code,
                taxId: view.taxId,
                name: view.name,
                description: view.description,
                active: view.active
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
            });

            if (!response.ok) {

                const error = await response.json();
                throw error;
            }

        } catch (failure: any) {

            throw new ErrorView(true, failure.message);
        }
    }    
}