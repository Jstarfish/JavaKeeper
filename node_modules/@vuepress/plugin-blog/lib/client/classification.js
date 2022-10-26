import { findPageByKey } from '@app/util';
import frontmatterClassifiedMap from '@dynamic/vuepress_blog/frontmatterClassified';
class Classifiable {
    constructor(metaMap, pages) {
        this._metaMap = Object.assign({}, metaMap);
        Object.keys(this._metaMap).forEach(name => {
            const { pageKeys } = this._metaMap[name];
            this._metaMap[name].pages = pageKeys.map(key => findPageByKey(pages, key));
        });
    }
    get length() {
        return Object.keys(this._metaMap).length;
    }
    get map() {
        return this._metaMap;
    }
    get pages() {
        return this.list;
    }
    get list() {
        return this.toArray();
    }
    toArray() {
        const tags = [];
        Object.keys(this._metaMap).forEach(name => {
            const { pages, path } = this._metaMap[name];
            tags.push({ name, pages, path });
        });
        return tags;
    }
    getItemByName(name) {
        return this._metaMap[name];
    }
}
export default ({ Vue }) => {
    const computed = Object.keys(frontmatterClassifiedMap)
        .map(classifiedType => {
        const map = frontmatterClassifiedMap[classifiedType];
        const helperName = `$${classifiedType}`;
        return {
            [helperName]() {
                const { pages } = this.$site;
                const classified = new Classifiable(map, pages);
                return classified;
            },
            [`$current${classifiedType.charAt(0).toUpperCase() +
                classifiedType.slice(1)}`]() {
                const tagName = this.$route.meta.id;
                return this[helperName].getItemByName(tagName);
            },
        };
    })
        .reduce((map, item) => {
        Object.assign(map, item);
        return map;
    }, {});
    computed.$frontmatterKey = function () {
        const target = this[`$${this.$route.meta.id}`];
        if (target) {
            return target;
        }
        return null;
    };
    Vue.mixin({
        computed,
    });
};
