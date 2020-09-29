import { FrontmatterHandler } from '../util';
import { PaginationConfig } from './Pagination';
export interface FrontmatterClassificationPage {
    id: string;
    entryTitle: string;
    pagination: PaginationConfig;
    keys: string[];
    scopeLayout?: string;
    map: Record<string, any>;
    _handler: FrontmatterHandler;
}
