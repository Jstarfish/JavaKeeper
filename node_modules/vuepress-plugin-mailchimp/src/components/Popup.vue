<template>
  <transition name="submit-popup">
    <slot :enabled="enabled" :message="message" :isError="isError">
      <div
        v-if="enabled"
        class="submit-popup"
        :class="{ error: isError }"
        data-cy="popup"
      >
        {{ message }}
      </div>
    </slot>
  </transition>
</template>

<script>
import event from '../event';
import { popupTimeout } from '@dynamic/mailchimpOptions';
export default {
  data() {
    return {
      submitEvent: null,
    };
  },

  computed: {
    enabled() {
      return Boolean(this.submitEvent);
    },

    message() {
      if (!this.submitEvent) return '';
      return this.submitEvent.result === 'success'
        ? 'Thank you for subscribing!'
        : 'Request failed!';
    },

    isError() {
      if (this.submitEvent && this.submitEvent.result === 'error') return true;
      return false;
    },
  },

  created() {
    event.$on('submited', this.onSubmited);
  },

  methods: {
    onSubmited(e) {
      this.submitEvent = e;
      setTimeout(() => {
        this.submitEvent = null;
      }, popupTimeout);
    },
  },
};
</script>

<style lang="stylus">
.submit-popup
  position fixed
  right 1em
  top $navbarHeight + 2em
  padding 1em
  border-radius 3px
  background-color $accentColor
  color #fff
  box-shadow 0 4px 16px rgba(0, 0, 0, 0.5)
  text-align center
  z-index 2

  button
    margin-top 0.5em
    padding 0.25em 2em

  &.error
    background-color $textColor

// transition
.submit-popup-enter-active, .submit-popup-leave-active
  transition transform 0.8s

.submit-popup-enter, .submit-popup-leave-to
  transform translate(200%, 0)
</style>
