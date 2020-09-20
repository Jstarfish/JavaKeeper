import { VuePressContext } from './interface/VuePress';
import { ClassifierTypeEnum } from './interface/Classifier';
import { PaginationConfig } from './interface/Pagination';
export declare type FrontmatterHandler = (key: string, pageKey: string) => void;
export interface FrontmatterTempMap {
    scope: string;
    path: string;
    pageKeys: string;
}
export declare function curryFrontmatterHandler(scope: string, map: FrontmatterTempMap, path: string): FrontmatterHandler;
export declare function logObject(title: any, o: any, spread?: boolean): void;
export declare function logTable(title: any, data: any): void;
export declare function logPages(title: any, pages: any): void;
export declare function resolvePaginationConfig(classifierType: ClassifierTypeEnum, globalPagination: PaginationConfig, pagination: PaginationConfig, indexPath: string, ctx: VuePressContext, keys?: string[]): {
    lengthPerPage: number;
    layout: string | undefined;
    getPaginationPageUrl(index: any): string;
    filter: Function;
    sorter: (prev: import("../types/VuePress").VuePressPage, next: import("../types/VuePress").VuePressPage) => 1 | -1;
} & PaginationConfig;
export declare function UpperFirstChar(str: any): any;
