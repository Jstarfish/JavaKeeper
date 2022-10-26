<template>
  <form class="newsletter" @submit.prevent="onSubmit">
    <slot :slotProps="slotProps">
      <div class="newsletter__wrap">
        <div class="newsletter__title">{{ slotProps.title }}</div>
        <div class="newsletter__content">{{ slotProps.content }}</div>
        <input
          v-model="slotProps.mail"
          class="newsletter__input"
          type="email"
          name="email"
          aria-label="Email"
          placeholder="Email"
          required
          autocapitalize="off"
          autocorrect="off"
          data-cy="email"
        />
        <button type="submit" class="newsletter__button" data-cy="submit">
          {{ slotProps.submitText }}
        </button>
      </div>
    </slot>
  </form>
</template>

<script>
import addToMailchimp from '../mailchimpSubscribe';
import event from '../event';
import _debug from 'debug';

const debug = _debug('plugin-mailchimp');

/**
 * If developers make UI customiztion and offer users an option whether to enable.
 * It won't be able to import client dynamic modules if it's disabled.
 * Use commonJs because dynamic import cannot be caught https://github.com/webpack/webpack/issues/5360
 */
let submitText, content, title, popupEnabled;

try {
  const options = require('@dynamic/mailchimpOptions');
  submitText = options.submitText;
  content = options.content;
  title = options.title;
  popupEnabled = options.popupEnabled;
} catch (error) {
  debug('Fail to get options', error.message);
}

export default {
  data() {
    return {
      slotProps: {
        mail: '',
        title: title || 'Newsletter',
        content: content || 'Subscribe to get my latest content. No spam.',
        submitText: submitText || 'Subscribe',
      },
    };
  },
  methods: {
    onSubmit() {
      addToMailchimp(this.slotProps.mail)
        .catch(err => {
          this.slotProps.mail = '';
          if (popupEnabled) event.$emit('submited', { result: 'error' });
        })
        .then(res => {
          this.slotProps.mail = '';
          if (popupEnabled) event.$emit('submited', res);
        });
    },
  },
};
</script>

<style lang="stylus">
.newsletter
  text-align center
  width 100%
  font-size 1rem
  color $textColor

  &__wrap
    margin 1.5rem auto
    padding 1.8rem 2.3rem
    border-radius 3px
    box-sizing border-box
    max-width 420px
    background #f8f8f8

  &__title
    font-size 1.7rem

  &__content
    margin-top 1.5rem
    margin-bottom 1.5rem
    line-height 1.7rem

  &__input
    font-size inherit
    border 1px solid $borderColor
    width 100%
    padding 0.6rem 1.2rem
    box-sizing border-box
    border-radius 3px
    margin-bottom 0.8rem
    outline none

  &__button
    font-size inherit
    border none
    cursor pointer
    background $accentColor
    color #fff
    padding 0.6rem 1.8rem
    box-sizing border-box
    border-radius 3px
    width 100%
    outline none
</style>
