import { VuePressPage } from './VuePress';
export interface PageEnhancer {
    filter($page: VuePressPage): boolean;
    frontmatter: Record<string, any>;
    data?: Record<string, any>;
}
