import { PagedView } from "../domain/PagedView"
import { SearchView } from "../domain/SearchView"
import { SearchWithDateRangeView } from "../domain/SearchWithDateRangeView"
import { SearchWithStatusAndTypeView } from "../domain/SearchWithStatusAndTypeView"
import { SearchWithStatusView } from "../domain/SearchWithStatusView"
import { SearchWithTypeView } from "../domain/SearchWithTypeView"
import { LocalDate } from "@js-joda/core";

export class CommonCrud {

    static buildDefaultSearchResponse<T>(): PagedView<T> {

        return {
            content: [],
            pageable: {
                pageSize: 25,
                totalElements: 0,
            }
        }
    }
    
    static buildDefaultSearchView(): SearchView {
    
        return {
            text: '',
            active: 1,
            category: '%',
            page: 0,
            size: 25
        }
    }

    static buildSearchWithTypeView(): SearchWithTypeView {

        return {
            text: '',
            type: '%',
            category: '%',
            active: 1,
            page: 0,
            size: 25
        }
    }

    static buildSearchWithStatusView(): SearchWithStatusView {

        return {
            text: '',
            status: '%',
            category: '%',
            page: 0,
            size: 25
        }
    }
 
    static buildSearchWithStatusAndTypeView(): SearchWithStatusAndTypeView {

        return {
            text: '',
            type: 'P',
            category: '%',
            status: 'A',
            page: 0,
            size: 25
        }
    }

    static buildSearchWithDateRangeView(): SearchWithDateRangeView {

        const finalDate = LocalDate.now()
            .plusDays(1);
            
        const initialDate = finalDate.minusMonths(2);

        return {

            type: '%',
            initialDate: initialDate.toString(),
            finalDate: finalDate.toString(),
            page: 0,
            size: 25,
            text: ''
        };
    }

    static paginationModelChange(searchView: SearchView, page: number, size: number) {
            
        return {
            ...searchView,
            page,
            size
        };
    }    
}