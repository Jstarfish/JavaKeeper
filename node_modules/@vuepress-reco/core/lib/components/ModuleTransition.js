var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from 'vue';
import Component from 'vue-class-component';
const ModuleTransitionProps = Vue.extend({
    props: {
        delay: {
            type: String,
            default: '0'
        },
        duration: {
            type: String,
            default: '.25'
        },
        transform: {
            type: Array,
            default() {
                return ['translateY(-20px)', 'translateY(0)'];
            }
        }
    }
});
let ModuleTransition = class ModuleTransition extends ModuleTransitionProps {
    setStyle(items) {
        items.style.transition = `transform ${this.duration}s ease-in-out ${this.delay}s, opacity ${this.duration}s ease-in-out ${this.delay}s`;
        items.style.transform = this.transform[0];
        items.style.opacity = 0;
    }
    unsetStyle(items) {
        items.style.transform = this.transform[1];
        items.style.opacity = 1;
    }
    render() {
        return (<transition {...{
            attrs: { name: 'module' },
            on: {
                enter: this.setStyle,
                appear: this.setStyle,
                'before-leave': this.setStyle,
                'after-appear': this.unsetStyle,
                'after-enter': this.unsetStyle
            }
        }}>{this.$slots.default}</transition>);
    }
};
ModuleTransition = __decorate([
    Component
], ModuleTransition);
export default ModuleTransition;
