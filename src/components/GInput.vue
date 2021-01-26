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
  name: 'GInput',
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
        'g-input',
        {
          'g-input-error': !this.valid,
          'g-input-password': this.type === 'password',
          'g-input-focus': this.focused,
        },
      ];
    },
  },
};
</script>

<style lang="scss">
.g-input {
  display: inline-block;
  padding: $space-xs $space-xs * 1.75;
  background-color: var(--color-wrapper);
  border-radius: $radius;
  height: 1.5rem + $space-xs * 2;
  position: relative;

  input {
    width: 100%;
    outline: none;
    border: none;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: $font-size-sm;
    background: transparent;
    color: var(--color-font);
  }
}

.g-input-focus {
  background-color: var(--color-hover);
}

.g-input-error {
  background-color: var(--color-error) !important;
}
</style>
