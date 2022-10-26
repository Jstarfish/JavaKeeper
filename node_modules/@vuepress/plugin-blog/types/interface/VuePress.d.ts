import { VuePressContext as BaseContext, VuePressPage as BasePage } from '../../types/VuePress';
import { FrontmatterClassificationPage } from './Frontmatter';
import { SerializedPagination } from './Pagination';
export interface VuePressContext extends BaseContext {
    frontmatterClassificationPages: FrontmatterClassificationPage[];
    serializedPaginations: SerializedPagination[];
    pageFilters: any;
    pageSorters: any;
    getLayout: (name?: string, fallback?: string) => string | undefined;
}
export declare type VuePressPage = BasePage;
