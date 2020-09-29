"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_utils_1 = require("@vuepress/shared-utils");
const util_1 = require("./util");
const Classifier_1 = require("./interface/Classifier");
function handleOptions(options, ctx) {
    let { directories = [] } = options;
    const { frontmatters = [], globalPagination = {}, } = options;
    directories = directories.filter(directory => {
        const targetDir = shared_utils_1.path.join(ctx.sourceDir, directory.dirname);
        if (shared_utils_1.fs.existsSync(targetDir)) {
            return true;
        }
        shared_utils_1.logger.warn(`[@vuepress/plugin-blog] Invalid directory classifier: ${shared_utils_1.chalk.cyan(directory.id)}, ` + `${shared_utils_1.chalk.gray(targetDir)} doesn't exist!`);
        return false;
    });
    const pageEnhancers = [];
    const frontmatterClassificationPages = [];
    const extraPages = [];
    const paginations = [];
    for (const directory of directories) {
        const { id, dirname, path: indexPath = `/${directory.id}/`, layout: indexLayout = 'IndexPost', frontmatter, itemLayout = 'Post', itemPermalink = '/:year/:month/:day/:slug', pagination = {}, } = directory;
        const { title = util_1.UpperFirstChar(id) } = directory;
        if (!indexPath) {
            continue;
        }
        extraPages.push({
            permalink: indexPath,
            frontmatter: {
                layout: ctx.getLayout(indexLayout),
                title,
                ...frontmatter,
            },
            meta: {
                pid: id,
                id,
            },
        });
        pageEnhancers.push({
            filter({ regularPath }) {
                const regex = new RegExp(`^/${dirname}/page/\\d+/`);
                return (Boolean(regularPath) &&
                    regularPath !== indexPath &&
                    !regex.test(regularPath) &&
                    regularPath.startsWith(`/${dirname}/`));
            },
            frontmatter: {
                layout: ctx.getLayout(itemLayout, 'Post'),
                permalink: itemPermalink,
            },
            data: { id, pid: id },
        });
        paginations.push({
            classifierType: Classifier_1.ClassifierTypeEnum.Directory,
            getPaginationPageTitle(pageNumber) {
                return `Page ${pageNumber} | ${title}`;
            },
            ...util_1.resolvePaginationConfig(Classifier_1.ClassifierTypeEnum.Directory, globalPagination, pagination, indexPath, ctx),
            pid: id,
            id,
        });
    }
    for (const frontmatterPage of frontmatters) {
        const { id, keys, path: indexPath, layout: indexLayout, scopeLayout, frontmatter, pagination = {}, } = frontmatterPage;
        const { title = util_1.UpperFirstChar(id) } = frontmatterPage;
        if (!indexPath) {
            continue;
        }
        extraPages.push({
            permalink: indexPath,
            frontmatter: {
                layout: ctx.getLayout(indexLayout, 'FrontmatterKey'),
                title,
                ...frontmatter,
            },
            meta: {
                pid: id,
                id,
            },
        });
        const map = {};
        frontmatterClassificationPages.push({
            id,
            entryTitle: title,
            pagination,
            keys,
            map,
            scopeLayout,
            _handler: util_1.curryFrontmatterHandler(id, map, indexPath),
        });
    }
    const plugins = [];
    const services = {
        comment: { enabled: false, service: '' },
        email: { enabled: false },
        feed: { rss: false, atom: false, json: false },
    };
    if (options.sitemap && options.sitemap.hostname) {
        const defaultSitemapOptions = { exclude: ['/404.html'] };
        const sitemapOptions = Object.assign({}, defaultSitemapOptions, options.sitemap);
        const sitemapDependencies = [
            ['vuepress-plugin-sitemap', sitemapOptions],
            ['@vuepress/last-updated'],
        ];
        plugins.push(...sitemapDependencies);
    }
    if (options.comment) {
        const { service: commentService, ...commentOptions } = options.comment;
        switch (commentService) {
            case 'vssue':
                plugins.push(['@vssue/vuepress-plugin-vssue', commentOptions]);
                services.comment.enabled = true;
                services.comment.service = commentService;
                break;
            case 'disqus':
                plugins.push(['vuepress-plugin-disqus', commentOptions]);
                services.comment.enabled = true;
                services.comment.service = commentService;
                break;
            default:
                shared_utils_1.logger.warn(`[@vuepress/plugin-blog] Invalid comment service: ${shared_utils_1.chalk.cyan(commentService)}`);
                break;
        }
    }
    if (options.newsletter && options.newsletter.endpoint) {
        plugins.push(['vuepress-plugin-mailchimp', options.newsletter]);
        services.email.enabled = true;
    }
    if (options.feed && options.feed.canonical_base) {
        const defaultFeedOptions = {
            posts_directories: [],
        };
        directories.forEach(dir => {
            defaultFeedOptions.posts_directories.push(`/${dir.dirname}/`);
        });
        services.feed = { rss: true, atom: true, json: true };
        if (options.feed.feeds) {
            if (options.feed.feeds.rss2 && options.feed.feeds.rss2.enable === false)
                services.feed.rss = false;
            if (options.feed.feeds.atom1 && options.feed.feeds.atom1.enable === false)
                services.feed.atom = false;
            if (options.feed.feeds.json1 && options.feed.feeds.json1.enable === false)
                services.feed.json = false;
        }
        const feedOptions = Object.assign({}, defaultFeedOptions, options.feed);
        plugins.push(['vuepress-plugin-feed', feedOptions]);
    }
    const processedData = {
        pageEnhancers,
        frontmatterClassificationPages,
        extraPages,
        paginations,
        plugins,
        services,
    };
    util_1.logObject('Handle options', processedData, true);
    return processedData;
}
exports.handleOptions = handleOptions;
