import { PaginationConfig } from './Pagination';
export interface DirectoryClassifier {
    id: string;
    dirname: string;
    path: string;
    title?: string;
    layout?: string;
    frontmatter?: Record<string, any>;
    itemLayout?: string;
    itemPermalink?: string;
    pagination?: PaginationConfig;
}
export interface FrontmatterClassifier {
    id: string;
    keys: string[];
    path: string;
    title?: string;
    layout?: string;
    scopeLayout?: string;
    frontmatter?: Record<string, any>;
    pagination?: PaginationConfig;
}
export interface VssueOptions {
    platform: 'github' | 'github-v4' | 'gitlab' | 'bitbucket' | 'gitee';
    owner: string;
    repo: string;
    clientId: string;
    clientSecret: string;
    baseURL: string;
    state: string;
    labels: Array<string>;
    prefix: string;
    admins: Array<string>;
    perPage: number;
    locale: string;
    proxy: string | ((url: string) => string);
    issueContent: (param: {
        options: VssueOptions;
        url: string;
    }) => string | Promise<string>;
    autoCreateIssue: boolean;
}
export interface DisqusOptions {
    shortname: string;
    identifier: string;
    url: string;
    title: string;
    remote_auth_s3: string;
    api_key: string;
    sso_config: any;
    language: string;
}
export interface Comment extends Partial<VssueOptions>, Partial<DisqusOptions> {
    service: 'vssue' | 'disqus';
}
export interface Newsletter {
    endpoint: string;
    title: string;
    content: string;
    popupConfig: PopupConfig;
}
interface PopupConfig {
    enabled: boolean;
    popupComponent: string;
    timeout: number;
}
export interface BlogPluginOptions {
    directories: DirectoryClassifier[];
    frontmatters: FrontmatterClassifier[];
    globalPagination: PaginationConfig;
    sitemap: any;
    feed: any;
    comment: Comment;
    newsletter: Newsletter;
}
export {};
