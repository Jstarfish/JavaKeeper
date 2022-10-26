import Vue from 'vue';
declare const RecoIconProps: import("vue/types/vue").ExtendedVue<Vue, unknown, unknown, unknown, {
    icon: string;
    link: string;
}>;
declare class RecoIcon extends RecoIconProps {
    getClass(icon: string): string;
    go(link: any): void;
    render(): any;
}
export default RecoIcon;
