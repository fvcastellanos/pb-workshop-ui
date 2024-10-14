import { Pageable } from "./Pageable";

export class SearchResponse<T> {

    content: T[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;

    pageable: Pageable;

}