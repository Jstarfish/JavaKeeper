import { BlogPluginOptions } from './interface/Options';
import { ExtraPage } from './interface/ExtraPages';
import { PageEnhancer } from './interface/PageEnhancer';
import { VuePressContext } from './interface/VuePress';
import { InternalPagination } from './interface/Pagination';
import { FrontmatterClassificationPage } from './interface/Frontmatter';
export declare function handleOptions(options: BlogPluginOptions, ctx: VuePressContext): {
    pageEnhancers: PageEnhancer[];
    frontmatterClassificationPages: FrontmatterClassificationPage[];
    extraPages: ExtraPage[];
    paginations: InternalPagination[];
    plugins: any[][];
    services: {
        comment: {
            enabled: boolean;
            service: string;
        };
        email: {
            enabled: boolean;
        };
        feed: {
            rss: boolean;
            atom: boolean;
            json: boolean;
        };
    };
};
