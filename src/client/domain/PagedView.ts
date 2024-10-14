import { PageableView } from "./PageableView";

export class PagedView<T> {

    pageable: PageableView;
    content: T[];
}