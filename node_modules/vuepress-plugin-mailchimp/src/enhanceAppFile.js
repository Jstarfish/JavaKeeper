import { popupEnabled } from '@dynamic/mailchimpOptions';

export default ({ Vue }) => {
  Vue.component('SimpleNewsletter', () =>
    import('./components/SimpleNewsletter.vue')
  );
  if (popupEnabled) {
    Vue.component('Popup', () => import('./components/Popup.vue'));
  }
};
