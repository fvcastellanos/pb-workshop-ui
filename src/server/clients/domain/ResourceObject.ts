import { Link } from "./Link";
import { SelfLink } from "./SelfLink";

export class ResourceObject {

    links?: Link[];
    selfLink?: SelfLink;
    _links?: SelfLink;

}