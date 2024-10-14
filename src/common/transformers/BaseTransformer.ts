import { PageableView } from "@/src/client/domain/PageableView";
import { Link } from "@/src/server/clients/domain/Link";
import { ResourceObject } from "@/src/server/clients/domain/ResourceObject";
import { SearchResponse } from "@/src/server/clients/domain/SearchResponse";
import { SelfLink } from "@/src/server/clients/domain/SelfLink";

export abstract class BaseTransformer {

    buildPageable<T>(searchResponse: SearchResponse<T>): PageableView {

        return {
            first: searchResponse.first,
            last: searchResponse.last,
            pageSize: searchResponse.size,
            numberOfElements: searchResponse.numberOfElements,
            totalElements: searchResponse.totalElements,
            totalPages: searchResponse.totalElements
        };
    }

    getId(resourceObject: ResourceObject): string {

        return resourceObject.links ? this.getIdFromLinks(resourceObject.links)
            : this.getIdFromSelfLink(resourceObject._links);
    }

    protected getIdFromSelfLink(selfLink: SelfLink): string
    {
        if ((selfLink != null) && (selfLink.self != null))
        {
            var self = selfLink.self.href;
            var index = self.lastIndexOf("/");

            return self.substring(index + 1);
        }

        return "";
    }

    protected getIdFromLinks(links: Link[]): string
    {
        if (links != null)
        {
            const self = links.find((link: Link) => link.rel === 'self');           
            const href = self.href;
            var index = href.lastIndexOf("/");

            return href.substring(index + 1);
        }

        return "";
    }
}