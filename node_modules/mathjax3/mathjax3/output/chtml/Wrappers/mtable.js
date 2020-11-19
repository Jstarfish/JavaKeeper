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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../Wrapper.js");
var mtable_js_1 = require("../../common/Wrappers/mtable.js");
var mtable_js_2 = require("../../../core/MmlTree/MmlNodes/mtable.js");
var string_js_1 = require("../../../util/string.js");
var CHTMLmtable = (function (_super) {
    __extends(CHTMLmtable, _super);
    function CHTMLmtable(factory, node, parent) {
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this, factory, node, parent) || this;
        _this.itable = _this.html('mjx-itable');
        _this.labels = _this.html('mjx-itable');
        return _this;
    }
    CHTMLmtable.prototype.getAlignShift = function () {
        var data = _super.prototype.getAlignShift.call(this);
        if (!this.isTop) {
            data[1] = 0;
        }
        return data;
    };
    CHTMLmtable.prototype.toCHTML = function (parent) {
        var chtml = this.standardCHTMLnode(parent);
        this.adaptor.append(chtml, this.html('mjx-table', {}, [this.itable]));
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                child.toCHTML(this.itable);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.padRows();
        this.handleColumnSpacing();
        this.handleColumnLines();
        this.handleColumnWidths();
        this.handleRowSpacing();
        this.handleRowLines();
        this.handleEqualRows();
        this.handleFrame();
        this.handleWidth();
        this.handleLabels();
        this.handleAlign();
        this.handleJustify();
        this.shiftColor();
        var e_1, _c;
    };
    CHTMLmtable.prototype.shiftColor = function () {
        var adaptor = this.adaptor;
        var color = adaptor.getStyle(this.chtml, 'backgroundColor');
        if (color) {
            adaptor.setStyle(this.chtml, 'backgroundColor', '');
            adaptor.setStyle(this.itable, 'backgroundColor', color);
        }
    };
    CHTMLmtable.prototype.padRows = function () {
        var adaptor = this.adaptor;
        try {
            for (var _a = __values(adaptor.childNodes(this.itable)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var row = _b.value;
                while (adaptor.childNodes(row).length < this.numCols) {
                    adaptor.append(row, this.html('mjx-mtd'));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var e_2, _c;
    };
    CHTMLmtable.prototype.handleColumnSpacing = function () {
        var spacing = this.getEmHalfSpacing(this.fSpace[0], this.cSpace);
        var frame = this.frame;
        try {
            for (var _a = __values(this.tableRows), _b = _a.next(); !_b.done; _b = _a.next()) {
                var row = _b.value;
                var i = 0;
                try {
                    for (var _c = __values(row.tableCells), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var cell = _d.value;
                        var lspace = spacing[i++];
                        var rspace = spacing[i];
                        var styleNode = (cell ? cell.chtml : this.adaptor.childNodes(row.chtml)[i]);
                        if ((i > 1 && lspace !== '0.4em') || (frame && i === 1)) {
                            this.adaptor.setStyle(styleNode, 'paddingLeft', lspace);
                        }
                        if ((i < this.numCols && rspace !== '0.4em') || (frame && i === this.numCols)) {
                            this.adaptor.setStyle(styleNode, 'paddingRight', rspace);
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var e_4, _f, e_3, _e;
    };
    CHTMLmtable.prototype.handleColumnLines = function () {
        if (this.node.attributes.get('columnlines') === 'none')
            return;
        var lines = this.getColumnAttributes('columnlines');
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var row = _b.value;
                var i = 0;
                try {
                    for (var _c = __values(this.adaptor.childNodes(row.chtml).slice(1)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var cell = _d.value;
                        var line = lines[i++];
                        if (line === 'none')
                            continue;
                        this.adaptor.setStyle(cell, 'borderLeft', '.07em ' + line);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
            }
            finally { if (e_6) throw e_6.error; }
        }
        var e_6, _f, e_5, _e;
    };
    CHTMLmtable.prototype.handleColumnWidths = function () {
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var row = _b.value;
                var i = 0;
                try {
                    for (var _c = __values(this.adaptor.childNodes(row.chtml)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var cell = _d.value;
                        var w = this.cWidths[i++];
                        if (w !== null) {
                            var width = (typeof w === 'number' ? this.em(w) : w);
                            this.adaptor.setStyle(cell, 'width', width);
                            this.adaptor.setStyle(cell, 'maxWidth', width);
                            this.adaptor.setStyle(cell, 'minWidth', width);
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
            }
            finally { if (e_8) throw e_8.error; }
        }
        var e_8, _f, e_7, _e;
    };
    CHTMLmtable.prototype.handleRowSpacing = function () {
        var spacing = this.getEmHalfSpacing(this.fSpace[1], this.rSpace);
        var frame = this.frame;
        var i = 0;
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var row = _b.value;
                var tspace = spacing[i++];
                var bspace = spacing[i];
                try {
                    for (var _c = __values(row.childNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var cell = _d.value;
                        if ((i > 1 && tspace !== '0.215em') || (frame && i === 1)) {
                            this.adaptor.setStyle(cell.chtml, 'paddingTop', tspace);
                        }
                        if ((i < this.numRows && bspace !== '0.215em') || (frame && i === this.numRows)) {
                            this.adaptor.setStyle(cell.chtml, 'paddingBottom', bspace);
                        }
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
            }
            finally { if (e_10) throw e_10.error; }
        }
        var e_10, _f, e_9, _e;
    };
    CHTMLmtable.prototype.handleRowLines = function () {
        if (this.node.attributes.get('rowlines') === 'none')
            return;
        var lines = this.getRowAttributes('rowlines');
        var i = 0;
        try {
            for (var _a = __values(this.childNodes.slice(1)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var row = _b.value;
                var line = lines[i++];
                if (line === 'none')
                    continue;
                try {
                    for (var _c = __values(this.adaptor.childNodes(row.chtml)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var cell = _d.value;
                        this.adaptor.setStyle(cell, 'borderTop', '.07em ' + line);
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
            }
            finally { if (e_12) throw e_12.error; }
        }
        var e_12, _f, e_11, _e;
    };
    CHTMLmtable.prototype.handleEqualRows = function () {
        if (!this.node.attributes.get('equalrows'))
            return;
        var space = this.getRowHalfSpacing();
        var _a = this.getTableData(), H = _a.H, D = _a.D, NH = _a.NH, ND = _a.ND;
        var HD = this.getEqualRowHeight();
        var HDem = this.em(HD);
        for (var i = 0; i < this.numRows; i++) {
            var row = this.childNodes[i];
            if (HD !== NH[i] + ND[i]) {
                this.setRowHeight(row, HD, (HD - H[i] + D[i]) / 2, space[i] + space[i + 1]);
            }
        }
    };
    CHTMLmtable.prototype.setRowHeight = function (row, HD, D, space) {
        this.adaptor.setStyle(row.chtml, 'height', this.em(HD + space));
        var ralign = row.node.attributes.get('rowalign');
        try {
            for (var _a = __values(row.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var cell = _b.value;
                if (this.setCellBaseline(cell, ralign, HD, D))
                    break;
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_13) throw e_13.error; }
        }
        var e_13, _c;
    };
    CHTMLmtable.prototype.setCellBaseline = function (cell, ralign, HD, D) {
        var calign = cell.node.attributes.get('rowalign');
        if (calign === 'baseline' || calign === 'axis') {
            var adaptor = this.adaptor;
            var child = adaptor.lastChild(cell.chtml);
            adaptor.setStyle(child, 'height', this.em(HD));
            adaptor.setStyle(child, 'verticalAlign', this.em(-D));
            var row = cell.parent;
            if ((!row.node.isKind('mlabeledtr') || cell !== row.childNodes[0]) &&
                (ralign === 'baseline' || ralign === 'axis')) {
                return true;
            }
        }
        return false;
    };
    CHTMLmtable.prototype.handleFrame = function () {
        if (this.frame) {
            this.adaptor.setStyle(this.itable, 'border', '.07em ' + this.node.attributes.get('frame'));
        }
    };
    CHTMLmtable.prototype.handleWidth = function () {
        var adaptor = this.adaptor;
        var _a = this.getBBox(), w = _a.w, L = _a.L, R = _a.R;
        adaptor.setStyle(this.chtml, 'minWidth', this.em(L + w + R));
        var W = this.node.attributes.get('width');
        if (string_js_1.isPercent(W)) {
            adaptor.setStyle(this.chtml, 'width', '');
            adaptor.setAttribute(this.chtml, 'width', 'full');
        }
        else if (!this.hasLabels) {
            if (W === 'auto')
                return;
            W = this.em(this.length2em(W) + 2 * this.fLine);
        }
        var table = adaptor.firstChild(this.chtml);
        adaptor.setStyle(table, 'width', W);
        adaptor.setStyle(table, 'minWidth', this.em(w));
        if (L || R) {
            adaptor.setStyle(this.chtml, 'margin', '');
            if (L === R) {
                adaptor.setStyle(table, 'margin', '0 ' + this.em(R));
            }
            else {
                adaptor.setStyle(table, 'margin', '0 ' + this.em(R) + ' 0 ' + this.em(L));
            }
        }
        adaptor.setAttribute(this.itable, 'width', 'full');
    };
    CHTMLmtable.prototype.handleAlign = function () {
        var _a = __read(this.getAlignmentRow(), 2), align = _a[0], row = _a[1];
        if (row === null) {
            if (align !== 'axis') {
                this.adaptor.setAttribute(this.chtml, 'align', align);
            }
        }
        else {
            var y = this.getVerticalPosition(row, align);
            this.adaptor.setAttribute(this.chtml, 'align', 'top');
            this.adaptor.setStyle(this.chtml, 'verticalAlign', this.em(y));
        }
    };
    CHTMLmtable.prototype.handleJustify = function () {
        var _a = __read(this.getAlignShift(), 2), align = _a[0], shift = _a[1];
        if (align !== 'center') {
            this.adaptor.setAttribute(this.chtml, 'justify', align);
        }
    };
    CHTMLmtable.prototype.handleLabels = function () {
        if (!this.hasLabels)
            return;
        var labels = this.labels;
        var attributes = this.node.attributes;
        var adaptor = this.adaptor;
        var side = attributes.get('side');
        adaptor.setAttribute(this.chtml, 'side', side);
        adaptor.setAttribute(labels, 'align', side);
        adaptor.setStyle(labels, side, '0');
        var _a = __read(this.addLabelPadding(side), 2), align = _a[0], shift = _a[1];
        if (shift) {
            var table = adaptor.firstChild(this.chtml);
            this.setIndent(table, align, shift);
        }
        this.updateRowHeights();
        this.addLabelSpacing();
    };
    CHTMLmtable.prototype.addLabelPadding = function (side) {
        var _a = __read(this.getPadAlignShift(side), 3), pad = _a[0], align = _a[1], shift = _a[2];
        var styles = {};
        if (side === 'right') {
            var W = this.node.attributes.get('width');
            var _b = this.getBBox(), w = _b.w, L = _b.L, R = _b.R;
            styles.style = {
                width: (string_js_1.isPercent(W) ? 'calc(' + W + ' + ' + this.em(L + R) + ')' : this.em(L + w + R)),
                minWidth: '100%'
            };
        }
        this.adaptor.append(this.chtml, this.html('mjx-labels', styles, [this.labels]));
        return [align, shift];
    };
    CHTMLmtable.prototype.updateRowHeights = function () {
        if (this.node.attributes.get('equalrows'))
            return;
        var _a = this.getTableData(), H = _a.H, D = _a.D, NH = _a.NH, ND = _a.ND;
        var space = this.getRowHalfSpacing();
        for (var i = 0; i < this.numRows; i++) {
            var row = this.childNodes[i];
            if (H[i] !== NH[i] || D[i] !== ND[i]) {
                this.setRowHeight(row, H[i] + D[i], D[i], space[i] + space[i + 1]);
            }
            else if (row.node.isKind('mlabeledtr')) {
                this.setCellBaseline(row.childNodes[0], '', H[i] + D[i], D[i]);
            }
        }
    };
    CHTMLmtable.prototype.addLabelSpacing = function () {
        var adaptor = this.adaptor;
        var equal = this.node.attributes.get('equalrows');
        var _a = this.getTableData(), H = _a.H, D = _a.D;
        var HD = (equal ? this.getEqualRowHeight() : 0);
        var space = this.getRowHalfSpacing();
        var h = this.fLine;
        var current = adaptor.firstChild(this.labels);
        for (var i = 0; i < this.numRows; i++) {
            var row = this.childNodes[i];
            if (row.node.isKind('mlabeledtr')) {
                h && adaptor.insert(this.html('mjx-mtr', { style: { height: this.em(h) } }), current);
                adaptor.setStyle(current, 'height', this.em((equal ? HD : H[i] + D[i]) + space[i] + space[i + 1]));
                current = adaptor.next(current);
                h = this.rLines[i];
            }
            else {
                h += space[i] + (equal ? HD : H[i] + D[i]) + space[i + 1] + this.rLines[i];
            }
        }
    };
    return CHTMLmtable;
}(mtable_js_1.CommonMtableMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLmtable.kind = mtable_js_2.MmlMtable.prototype.kind;
CHTMLmtable.styles = {
    'mjx-mtable': {
        'vertical-align': '.25em',
        'text-align': 'center',
        'position': 'relative',
        'box-sizing': 'border-box'
    },
    'mjx-labels': {
        position: 'absolute',
        left: 0,
        top: 0
    },
    'mjx-table': {
        'display': 'inline-block',
    },
    'mjx-table > mjx-itable': {
        'vertical-align': 'middle',
        'text-align': 'left',
        'box-sizing': 'border-box'
    },
    'mjx-labels > mjx-itable': {
        position: 'absolute',
        top: 0
    },
    'mjx-mtable[justify="left"]': {
        'text-align': 'left'
    },
    'mjx-mtable[justify="right"]': {
        'text-align': 'right'
    },
    'mjx-mtable[justify="left"][side="left"]': {
        'padding-right': '0 ! important'
    },
    'mjx-mtable[justify="left"][side="right"]': {
        'padding-left': '0 ! important'
    },
    'mjx-mtable[justify="right"][side="left"]': {
        'padding-right': '0 ! important'
    },
    'mjx-mtable[justify="right"][side="right"]': {
        'padding-left': '0 ! important'
    },
    'mjx-mtable[align]': {
        'vertical-align': 'baseline'
    },
    'mjx-mtable[align="top"] > mjx-table': {
        'vertical-align': 'top'
    },
    'mjx-mtable[align="bottom"] > mjx-table': {
        'vertical-align': 'bottom'
    },
    'mjx-mtable[align="center"] > mjx-table': {
        'vertical-align': 'middle'
    },
    'mjx-mtable[align="baseline"] > mjx-table': {
        'vertical-align': 'middle'
    }
};
exports.CHTMLmtable = CHTMLmtable;
//# sourceMappingURL=mtable.js.map