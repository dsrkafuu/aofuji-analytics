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
    // classes
    classes() {
      return [
        'g-input',
        {
          'g-input-error': !(() => {
            if (this.validator) {
              return this.validator(this.value);
            }
            switch (this.type) {
              default:
                return true;
            }
          }),
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

  &.g-input-focus {
    background-color: var(--color-hover);
  }

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

  &.g-input-password input {
    font-family: initial !important;
  }
}
</style>
