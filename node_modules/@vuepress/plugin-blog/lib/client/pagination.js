import Vue from 'vue';
import paginations from '@dynamic/vuepress_blog/paginations';
import _debug from 'debug';
const debug = _debug('plugin-blog:pagination');
class Pagination {
    constructor(pagination, pages, route) {
        debug('pagination', pagination);
        const { pages: paginationPages, prevText, nextText } = pagination;
        const { path } = route;
        this._prevText = prevText;
        this._nextText = nextText;
        for (let i = 0, l = paginationPages.length; i < l; i++) {
            const page = paginationPages[i];
            if (page.path === path) {
                this.paginationIndex = i;
                break;
            }
        }
        if (!this.paginationIndex) {
            this.paginationIndex = 0;
        }
        this._paginationPages = paginationPages;
        this._currentPage = paginationPages[this.paginationIndex];
        this._matchedPages = pages
            .filter(page => pagination.filter(page, pagination.id, pagination.pid))
            .sort(pagination.sorter);
    }
    setIndexPage(path) {
        this._indexPage = path;
    }
    get length() {
        return this._paginationPages.length;
    }
    get pages() {
        const [start, end] = this._currentPage.interval;
        return this._matchedPages.slice(start, end + 1);
    }
    get hasPrev() {
        return this.paginationIndex !== 0;
    }
    get prevLink() {
        if (this.hasPrev) {
            if (this.paginationIndex - 1 === 0 && this._indexPage) {
                return this._indexPage;
            }
            return this._paginationPages[this.paginationIndex - 1].path;
        }
        return null;
    }
    get hasNext() {
        return this.paginationIndex !== this.length - 1;
    }
    get nextLink() {
        if (this.hasNext) {
            return this._paginationPages[this.paginationIndex + 1].path;
        }
        return null;
    }
    get prevText() {
        return this._prevText;
    }
    get nextText() {
        return this._nextText;
    }
    getSpecificPageLink(index) {
        return this._paginationPages[index].path;
    }
}
class PaginationGateway {
    constructor(paginations) {
        this.paginations = paginations;
    }
    get pages() {
        return Vue.$vuepress.$get('siteData').pages;
    }
    getPagination(pid, id, route) {
        debug('id', id);
        debug('pid', pid);
        const pagnination = this.paginations.filter(p => p.id === id && p.pid === pid)[0];
        return new Pagination(pagnination, this.pages, route);
    }
}
const gateway = new PaginationGateway(paginations);
export default ({ Vue }) => {
    Vue.mixin({
        computed: {
            $pagination() {
                if (!this.$route.meta.pid || !this.$route.meta.id) {
                    return null;
                }
                return this.$getPagination(this.$route.meta.pid, this.$route.meta.id);
            },
        },
        methods: {
            $getPagination(pid, id) {
                id = id || pid;
                return gateway.getPagination(pid, id, this.$route);
            },
        },
    });
};
