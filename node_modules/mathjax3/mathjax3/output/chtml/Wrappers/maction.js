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
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../Wrapper.js");
var maction_js_1 = require("../../common/Wrappers/maction.js");
var maction_js_2 = require("../../common/Wrappers/maction.js");
var maction_js_3 = require("../../../core/MmlTree/MmlNodes/maction.js");
var CHTMLmaction = (function (_super) {
    __extends(CHTMLmaction, _super);
    function CHTMLmaction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmaction.prototype.toCHTML = function (parent) {
        var chtml = this.standardCHTMLnode(parent);
        var child = this.selected;
        child.toCHTML(chtml);
        this.action(this, this.data);
    };
    CHTMLmaction.prototype.setEventHandler = function (type, handler) {
        this.chtml.addEventListener(type, handler);
    };
    return CHTMLmaction;
}(maction_js_1.CommonMactionMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLmaction.kind = maction_js_3.MmlMaction.prototype.kind;
CHTMLmaction.styles = {
    'mjx-maction': {
        position: 'relative'
    },
    'mjx-maction > mjx-tool': {
        display: 'none',
        position: 'absolute',
        bottom: 0, right: 0,
        Width: 0, height: 0
    },
    'mjx-tool > mjx-tip': {
        display: 'inline-block',
        padding: '.2em',
        border: '1px solid #888',
        'font-size': '70%',
        'background-color': '#F8F8F8',
        color: 'black',
        'box-shadow': '2px 2px 5px #AAAAAA'
    },
    'mjx-maction[toggle]': {
        cursor: 'pointer'
    },
    'mjx-status': {
        display: 'block',
        position: 'fixed',
        left: '1em',
        bottom: '1em',
        'min-width': '25%',
        padding: '.2em .4em',
        border: '1px solid #888',
        'font-size': '90%',
        'background-color': '#F8F8F8',
        color: 'black'
    }
};
CHTMLmaction.actions = new Map([
    ['toggle', [function (node, data) {
                node.adaptor.setAttribute(node.chtml, 'toggle', node.node.attributes.get('selection'));
                var math = node.factory.jax.math;
                var document = node.factory.jax.document;
                var mml = node.node;
                node.setEventHandler('click', function (event) {
                    if (!math.start.node) {
                        math.start.node = math.end.node = math.typesetRoot;
                        math.start.n = math.end.n = 0;
                    }
                    mml.nextToggleSelection();
                    math.rerender(document);
                    event.stopPropagation();
                });
            }, {}]],
    ['tooltip', [function (node, data) {
                var tip = node.childNodes[1];
                if (!tip)
                    return;
                if (tip.node.isKind('mtext')) {
                    var text = tip.node.getText();
                    node.adaptor.setAttribute(node.chtml, 'title', text);
                }
                else {
                    var adaptor_1 = node.adaptor;
                    var tool_1 = adaptor_1.append(node.chtml, node.html('mjx-tool', {
                        style: { bottom: node.em(-node.dy), right: node.em(-node.dx) }
                    }, [node.html('mjx-tip')]));
                    tip.toCHTML(adaptor_1.firstChild(tool_1));
                    node.setEventHandler('mouseover', function (event) {
                        data.stopTimers(data);
                        data.hoverTimer = setTimeout(function () { return adaptor_1.setStyle(tool_1, 'display', 'block'); }, data.postDelay);
                        event.stopPropagation();
                    });
                    node.setEventHandler('mouseout', function (event) {
                        data.stopTimers(data);
                        data.clearTimer = setTimeout(function () { return adaptor_1.setStyle(tool_1, 'display', ''); }, data.clearDelay);
                        event.stopPropagation();
                    });
                }
            }, maction_js_2.TooltipData]],
    ['statusline', [function (node, data) {
                var tip = node.childNodes[1];
                if (!tip)
                    return;
                if (tip.node.isKind('mtext')) {
                    var adaptor_2 = node.adaptor;
                    var text_1 = tip.node.getText();
                    adaptor_2.setAttribute(node.chtml, 'statusline', text_1);
                    node.setEventHandler('mouseover', function (event) {
                        if (data.status === null) {
                            var body = adaptor_2.body(adaptor_2.document);
                            data.status = adaptor_2.append(body, node.html('mjx-status', {}, [node.text(text_1)]));
                        }
                        event.stopPropagation();
                    });
                    node.setEventHandler('mouseout', function (event) {
                        if (data.status) {
                            adaptor_2.remove(data.status);
                            data.status = null;
                        }
                        event.stopPropagation();
                    });
                }
            }, {
                status: null
            }]]
]);
exports.CHTMLmaction = CHTMLmaction;
//# sourceMappingURL=maction.js.map