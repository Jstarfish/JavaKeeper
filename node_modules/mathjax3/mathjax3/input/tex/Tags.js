"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TexParser_js_1 = require("./TexParser.js");
var Label = (function () {
    function Label(tag, id) {
        if (tag === void 0) { tag = '???'; }
        if (id === void 0) { id = ''; }
        this.tag = tag;
        this.id = id;
    }
    return Label;
}());
exports.Label = Label;
var TagInfo = (function () {
    function TagInfo(env, taggable, defaultTags, tag, tagId, tagFormat, noTag, labelId) {
        if (env === void 0) { env = ''; }
        if (taggable === void 0) { taggable = false; }
        if (defaultTags === void 0) { defaultTags = false; }
        if (tag === void 0) { tag = null; }
        if (tagId === void 0) { tagId = ''; }
        if (tagFormat === void 0) { tagFormat = ''; }
        if (noTag === void 0) { noTag = false; }
        if (labelId === void 0) { labelId = ''; }
        this.env = env;
        this.taggable = taggable;
        this.defaultTags = defaultTags;
        this.tag = tag;
        this.tagId = tagId;
        this.tagFormat = tagFormat;
        this.noTag = noTag;
        this.labelId = labelId;
    }
    return TagInfo;
}());
exports.TagInfo = TagInfo;
var AbstractTags = (function () {
    function AbstractTags() {
        this.counter = 0;
        this.offset = 0;
        this.configuration = null;
        this.ids = {};
        this.allIds = {};
        this.labels = {};
        this.allLabels = {};
        this.refs = new Array();
        this.currentTag = new TagInfo();
        this.history = [];
        this.stack = [];
        this.enTag = function (node, tag) {
            var nf = this.configuration.nodeFactory;
            var cell = nf.create('node', 'mtd', [node]);
            var row = nf.create('node', 'mlabeledtr', [tag, cell]);
            var table = nf.create('node', 'mtable', [row], {
                side: this.configuration.options['TagSide'],
                minlabelspacing: this.configuration.options['TagIndent'],
                displaystyle: true
            });
            return table;
        };
    }
    AbstractTags.prototype.start = function (env, taggable, defaultTags) {
        if (this.currentTag) {
            this.stack.push(this.currentTag);
        }
        this.currentTag = new TagInfo(env, taggable, defaultTags);
    };
    Object.defineProperty(AbstractTags.prototype, "env", {
        get: function () {
            return this.currentTag.env;
        },
        enumerable: true,
        configurable: true
    });
    AbstractTags.prototype.end = function () {
        this.history.push(this.currentTag);
        this.currentTag = this.stack.pop();
    };
    AbstractTags.prototype.tag = function (tag, noFormat) {
        this.currentTag.tag = tag;
        this.currentTag.tagFormat = noFormat ? tag : this.formatTag(tag);
        this.currentTag.noTag = false;
    };
    AbstractTags.prototype.notag = function () {
        this.tag('', true);
        this.currentTag.noTag = true;
    };
    Object.defineProperty(AbstractTags.prototype, "noTag", {
        get: function () {
            return this.currentTag.noTag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractTags.prototype, "label", {
        get: function () {
            return this.currentTag.labelId;
        },
        set: function (label) {
            this.currentTag.labelId = label;
        },
        enumerable: true,
        configurable: true
    });
    AbstractTags.prototype.formatUrl = function (id, base) {
        return base + '#' + encodeURIComponent(id);
    };
    AbstractTags.prototype.formatTag = function (tag) {
        return '(' + tag + ')';
    };
    AbstractTags.prototype.formatId = function (id) {
        return 'mjx-eqn-' + id.replace(/\s/g, '_');
    };
    AbstractTags.prototype.formatNumber = function (n) {
        return n.toString();
    };
    AbstractTags.prototype.autoTag = function () {
        if (this.currentTag.tag == null) {
            this.counter++;
            this.tag(this.counter.toString(), false);
        }
    };
    AbstractTags.prototype.clearTag = function () {
        this.label = '';
        this.tag(null, true);
        this.currentTag.tagId = '';
    };
    AbstractTags.prototype.getTag = function (force) {
        if (force === void 0) { force = false; }
        if (force) {
            this.autoTag();
            return this.makeTag();
        }
        var ct = this.currentTag;
        if (ct.taggable && !ct.noTag) {
            if (ct.defaultTags) {
                this.autoTag();
            }
            else {
                return null;
            }
            return this.makeTag();
        }
        return null;
    };
    AbstractTags.prototype.resetTag = function () {
        this.history = [];
        this.clearTag();
    };
    AbstractTags.prototype.reset = function (offset) {
        if (offset === void 0) { offset = 0; }
        this.resetTag();
        this.offset = offset;
        this.labels = {};
        this.ids = {};
    };
    AbstractTags.prototype.finalize = function (node, env) {
        if (!env.display || this.currentTag.env ||
            this.currentTag.tag == null) {
            return node;
        }
        var tag = this.makeTag();
        var table = this.enTag(node, tag);
        return table;
    };
    AbstractTags.prototype.makeId = function () {
        this.currentTag.tagId = this.formatId(this.configuration.options['useLabelIds'] ?
            (this.label || this.currentTag.tag) : this.currentTag.tag);
    };
    AbstractTags.prototype.makeTag = function () {
        this.makeId();
        if (this.label) {
            this.labels[this.label] = new Label(this.currentTag.tag, this.currentTag.tagId);
        }
        var mml = new TexParser_js_1.default('\\text{' + this.currentTag.tagFormat + '}', {}, this.configuration).mml();
        return this.configuration.nodeFactory.create('node', 'mtd', [mml], { id: this.currentTag.tagId });
    };
    return AbstractTags;
}());
exports.AbstractTags = AbstractTags;
;
var NoTags = (function (_super) {
    __extends(NoTags, _super);
    function NoTags() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoTags.prototype.autoTag = function () { };
    NoTags.prototype.getTag = function () {
        return !this.currentTag.tag ? null : _super.prototype.getTag.call(this);
    };
    return NoTags;
}(AbstractTags));
exports.NoTags = NoTags;
var AllTags = (function (_super) {
    __extends(AllTags, _super);
    function AllTags() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AllTags.prototype.finalize = function (node, env) {
        if (!env.display || this.history.find(function (x) { return x.taggable; })) {
            return node;
        }
        var tag = this.getTag(true);
        return this.enTag(node, tag);
    };
    return AllTags;
}(AbstractTags));
exports.AllTags = AllTags;
var TagsFactory;
(function (TagsFactory) {
    var tagsMapping = new Map([
        ['none', NoTags],
        ['all', AllTags]
    ]);
    var defaultTags = 'none';
    TagsFactory.OPTIONS = {
        tags: defaultTags,
        TagSide: 'right',
        TagIndent: '0.8em',
        MultLineWidth: '85%',
        useLabelIds: true,
        refUpdate: false
    };
    TagsFactory.add = function (name, constr) {
        tagsMapping.set(name, constr);
    };
    TagsFactory.addTags = function (tags) {
        try {
            for (var _a = __values(Object.keys(tags)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                TagsFactory.add(key, tags[key]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _c;
    };
    TagsFactory.create = function (name) {
        var constr = tagsMapping.get(name) || this.defaultTags;
        return new constr();
    };
    TagsFactory.setDefault = function (name) {
        defaultTags = name;
    };
    TagsFactory.getDefault = function () {
        return TagsFactory.create(defaultTags);
    };
})(TagsFactory = exports.TagsFactory || (exports.TagsFactory = {}));
//# sourceMappingURL=Tags.js.map