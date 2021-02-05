<template>
  <div :class="classes">
    <input
      v-bind="$attrs"
      :value="value"
      v-on="inputListeners"
      :type="type === 'password' && 'password'"
      autocomplete="on"
      autofocus="off"
    />
  </div>
</template>

<script>
export default {
  name: 'VInput',
  props: {
    value: String,
    type: String,
    validator: [Function, Boolean],
  },
  data() {
    return {
      focused: false,
    };
  },
  computed: {
    // https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components
    inputListeners() {
      return Object.assign({}, this.$listeners, {
        input: (event) => {
          this.$emit('input', event.target.value);
        },
        focus: () => (this.focused = true),
        blur: () => (this.focused = false),
      });
    },
    valid() {
      let valid = true;
      if (this.validator) {
        valid = this.validator(this.value);
      }
      return valid;
    },
    // classes
    classes() {
      return [
        'v-input',
        {
          'v-input-error': !this.valid,
          'v-input-password': this.type === 'password',
          'v-input-focus': this.focused,
        },
      ];
    },
  },
};
</script>

<style lang="scss">
.v-input {
  display: inline-block;
  padding: $space-xs $space-xs * 1.75;
  background-color: var(--color-wrapper);
  border-radius: $radius;
  height: $input-height;
  position: relative;

  input {
    width: $input-min-width;
    outline: none;
    border: none;
    height: $input-inner-height;
    line-height: $input-inner-height;
    font-size: $font-size-sm;
    background: transparent;
    color: var(--color-font);
  }

  &-focus {
    background-color: var(--color-hover);
  }

  &-error {
    background-color: var(--color-error) !important;
  }
}
</style>
