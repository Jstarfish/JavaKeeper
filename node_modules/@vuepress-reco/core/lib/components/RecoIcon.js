var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from 'vue';
import Component from 'vue-class-component';
const ICON_REGEXP = /^(\w+)\-/;
const RecoIconProps = Vue.extend({
    props: {
        icon: {
            type: String,
            default: ''
        },
        link: {
            type: String,
            default: ''
        }
    }
});
let RecoIcon = class RecoIcon extends RecoIconProps {
    getClass(icon) {
        if (ICON_REGEXP.test(icon)) {
            return icon.replace(ICON_REGEXP, (...args) => {
                return args[1] === 'reco' ? `iconfont ${args[0]}` : `${args[1]} ${args[0]}`;
            });
        }
        return '';
    }
    go(link) {
        if (link === '')
            return;
        window.open(link);
    }
    render() {
        return (<i {...{
            class: this.getClass(this.icon),
            on: { click: this.go.bind(this, this.link) }
        }}>
        {this.$slots.default}
      </i>);
    }
};
RecoIcon = __decorate([
    Component
], RecoIcon);
export default RecoIcon;
