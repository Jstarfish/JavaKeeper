"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_utils_1 = require("@vuepress/shared-utils");
const handleOptions_1 = require("./handleOptions");
const pagination_1 = require("./pagination");
const util_1 = require("./util");
const Classifier_1 = require("./interface/Classifier");
function injectExtraAPI(ctx) {
    const { layoutComponentMap } = ctx.themeAPI;
    const isLayoutExists = name => layoutComponentMap[name] !== undefined;
    ctx.getLayout = (name, fallback) => {
        return isLayoutExists(name) ? name : fallback || 'Layout';
    };
}
module.exports = (options, ctx) => {
    injectExtraAPI(ctx);
    const { pageEnhancers, frontmatterClassificationPages, extraPages, paginations, plugins, services, } = handleOptions_1.handleOptions(options, ctx);
    return {
        name: 'vuepress-plugin-blog',
        extendPageData(pageCtx) {
            pageEnhancers.forEach(({ filter, data = {}, frontmatter = {} }) => {
                const { frontmatter: rawFrontmatter } = pageCtx;
                if (filter(pageCtx)) {
                    Object.keys(frontmatter).forEach(key => {
                        if (!rawFrontmatter[key]) {
                            rawFrontmatter[key] = frontmatter[key];
                        }
                    });
                    Object.assign(pageCtx, data);
                }
            });
        },
        async ready() {
            const { pages } = ctx;
            for (const { key: pageKey, frontmatter } of pages) {
                if (!frontmatter || Object.keys(frontmatter).length === 0) {
                    continue;
                }
                for (const { keys, _handler } of frontmatterClassificationPages) {
                    for (const key of keys) {
                        const fieldValue = frontmatter[key];
                        Array.isArray(fieldValue)
                            ? fieldValue.forEach(v => _handler(v, pageKey))
                            : _handler(fieldValue, pageKey);
                    }
                }
            }
            for (const { map } of frontmatterClassificationPages) {
                util_1.logTable('frontmatterClassificationPages.map', map);
            }
            ctx.frontmatterClassificationPages = frontmatterClassificationPages;
            const allExtraPages = [
                ...extraPages,
                ...frontmatterClassificationPages
                    .map(frontmatterClassifiedPage => {
                    const { entryTitle, map, pagination, keys, scopeLayout, } = frontmatterClassifiedPage;
                    return Object.keys(map).map(key => {
                        const { path, scope } = map[key];
                        paginations.push({
                            classifierType: Classifier_1.ClassifierTypeEnum.Frontmatter,
                            getPaginationPageTitle(pageNumber, key) {
                                return `Page ${pageNumber} - ${key} | ${entryTitle}`;
                            },
                            ...util_1.resolvePaginationConfig(Classifier_1.ClassifierTypeEnum.Frontmatter, options.globalPagination, pagination, path, ctx, keys),
                            pid: scope,
                            id: key,
                        });
                        return {
                            permalink: path,
                            meta: {
                                pid: scope,
                                id: key,
                            },
                            pid: scope,
                            id: key,
                            frontmatter: {
                                layout: ctx.getLayout(scopeLayout, Classifier_1.DefaultLayoutEnum.FrontmatterPagination),
                                title: `${key} ${entryTitle}`,
                            },
                        };
                    });
                })
                    .reduce((arr, next) => arr.concat(next), []),
            ];
            util_1.logPages(`Automatically Added Index Pages`, allExtraPages);
            util_1.logObject(`Pagination data sources`, paginations);
            await Promise.all(allExtraPages.map(async (page) => ctx.addPage(page)));
            await pagination_1.registerPaginations(paginations, ctx);
        },
        async clientDynamicModules() {
            const frontmatterClassifiedMap = ctx.frontmatterClassificationPages.reduce((map, page) => {
                map[page.id] = page.map;
                return map;
            }, {});
            const PREFIX = 'vuepress_blog';
            return [
                {
                    name: `${PREFIX}/frontmatterClassified.js`,
                    content: `export default ${JSON.stringify(frontmatterClassifiedMap, null, 2)}`,
                },
                {
                    name: `${PREFIX}/paginations.js`,
                    content: `
import sorters from './pageSorters'
import filters from './pageFilters'

export default ${serializePaginations(ctx.serializedPaginations, [
                        'filter',
                        'sorter',
                    ])}
`,
                },
                {
                    name: `${PREFIX}/pageFilters.js`,
                    content: `export default ${mapToString(ctx.pageFilters, true)}`,
                },
                {
                    name: `${PREFIX}/pageSorters.js`,
                    content: `export default ${mapToString(ctx.pageSorters, true)}`,
                },
                {
                    name: `${PREFIX}/services.js`,
                    content: `export default ${mapToString(services)}`,
                },
            ];
        },
        enhanceAppFiles: [
            shared_utils_1.path.resolve(__dirname, '../client/classification.js'),
            shared_utils_1.path.resolve(__dirname, '../client/pagination.js'),
            shared_utils_1.path.resolve(__dirname, '../client/services.js'),
        ],
        plugins,
    };
};
function serializePaginations(paginations, unstringedKeys = []) {
    return `[${paginations
        .map(p => mapToString(p, unstringedKeys))
        .join(',\n')}]`;
}
function mapToString(map, unstringedKeys = []) {
    const keys = unstringedKeys;
    let str = `{\n`;
    for (const key of Object.keys(map)) {
        str += `  ${key}: ${keys === true || (Array.isArray(keys) && keys.includes(key))
            ? map[key]
            : JSON.stringify(map[key])},\n`;
    }
    str += '}';
    return str;
}
