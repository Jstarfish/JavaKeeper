import { VuePressPage } from './VuePress';
import { ClassifierTypeEnum } from './Classifier';
export declare type PageFilter = (page: VuePressPage, id: string, pid: string) => boolean;
export declare type PageSorter = (prev: VuePressPage, next: VuePressPage) => boolean | number;
export declare type GetPaginationPageUrl = (index: number) => string;
export declare type GetPaginationPageTitle = (index: number, id: string, scope: string) => string;
export interface PaginationConfig extends Partial<LinkText> {
    filter?: PageFilter;
    sorter?: PageSorter;
    lengthPerPage?: number;
    layout?: string;
    getPaginationPageUrl?: GetPaginationPageUrl;
    getPaginationPageTitle?: GetPaginationPageTitle;
}
export interface PaginationIdentity {
    pid: string;
    id: string;
}
export interface InternalPagination extends PaginationConfig, PaginationIdentity {
    classifierType: ClassifierTypeEnum;
}
export interface SerializedPagination extends PaginationIdentity, LinkText {
    filter: string;
    sorter: string;
    pages: PaginationPage[];
}
interface LinkText {
    prevText: string;
    nextText: string;
}
interface PaginationPage {
    path: string;
    interval: Array<number>;
}
export {};
