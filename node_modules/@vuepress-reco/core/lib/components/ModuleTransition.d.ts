import Vue from 'vue';
declare const ModuleTransitionProps: import("vue/types/vue").ExtendedVue<Vue, unknown, unknown, unknown, {
    delay: string;
    duration: string;
    transform: unknown[];
}>;
declare class ModuleTransition extends ModuleTransitionProps {
    setStyle(items: any): void;
    unsetStyle(items: any): void;
    render(): any;
}
export default ModuleTransition;
