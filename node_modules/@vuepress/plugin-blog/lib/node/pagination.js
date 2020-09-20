"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
function getIntervallers(max, interval) {
    const count = max % interval === 0
        ? Math.floor(max / interval)
        : Math.floor(max / interval) + 1;
    const arr = [...new Array(count)];
    return arr.map((_, index) => {
        const start = index * interval;
        const end = (index + 1) * interval - 1;
        return [start, end > max ? max : end];
    });
}
async function registerPaginations(paginations, ctx) {
    ctx.serializedPaginations = [];
    ctx.pageFilters = [];
    ctx.pageSorters = [];
    function recordPageFilters(pid, filter) {
        if (ctx.pageFilters[pid])
            return;
        ctx.pageFilters[pid] = filter.toString();
    }
    function recordPageSorters(pid, sorter) {
        if (ctx.pageSorters[pid])
            return;
        ctx.pageSorters[pid] = sorter.toString();
    }
    for (const { pid, id, filter, sorter, layout, lengthPerPage, prevText = 'Prev', nextText = 'Next', getPaginationPageUrl, getPaginationPageTitle, } of paginations) {
        const { pages: sourcePages } = ctx;
        const pages = sourcePages.filter(page => filter(page, id, pid));
        const intervallers = getIntervallers(pages.length, lengthPerPage);
        util_1.logObject(`${id}'s page intervaller`, intervallers);
        const pagination = {
            pid,
            id,
            filter: `filters.${pid}`,
            sorter: `sorters.${pid}`,
            pages: intervallers.map((interval, index) => {
                const path = getPaginationPageUrl(index);
                return { path, interval };
            }),
            prevText,
            nextText,
        };
        recordPageFilters(pid, filter);
        recordPageSorters(pid, sorter);
        if (pagination.pages.length > 1) {
            const extraPages = pagination.pages
                .slice(1)
                .map(({ path }, index) => {
                const pageNumber = index + 2;
                return {
                    permalink: path,
                    frontmatter: {
                        layout,
                        title: getPaginationPageTitle(pageNumber, id, pid),
                    },
                    meta: {
                        pid,
                        id,
                    },
                };
            });
            util_1.logPages(`Automatically generated pagination pages`, extraPages);
            await Promise.all(extraPages.map(page => ctx.addPage(page)));
        }
        ctx.serializedPaginations.push(pagination);
    }
}
exports.registerPaginations = registerPaginations;
