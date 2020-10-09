import services from '@dynamic/vuepress_blog/services';
export default ({ Vue }) => {
    const computed = {
        $service() {
            return services;
        },
    };
    Vue.mixin({
        computed,
    });
};
