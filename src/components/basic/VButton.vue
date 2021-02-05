<script>
export default {
  render(h) {
    // init tag
    const tag = this.$attrs.href ? 'a' : 'div';

    // apply classes and dom props
    const options = {
      class: this.buttonClasses,
      attrs: { ...this.$attrs },
      on: {
        click: this.onClick,
      },
    };

    return h(tag, options, this.$slots.default);
  },
  name: 'VButton',
  props: {
    active: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      validator: (val) => {
        return ['full-width', 'full-height', 'default'].includes(val); // button type available
      },
      default: 'default', // common button by default
    },
  },
  computed: {
    buttonClasses() {
      return [
        'v-button',
        `v-button-${this.type}`,
        {
          'v-button-disabled': this.disabled,
        },
        {
          'v-button-active': this.active,
        },
      ];
    },
  },
  methods: {
    onClick(e) {
      this.$emit('click', e);
    },
  },
};
</script>

<style lang="scss">
.v-button {
  color: var(--color-font);
  background-color: transparent;
  text-align: center;
  user-select: none;

  /* icon support */
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: var(--color-hover);
  }

  &-default {
    display: inline-flex;
    border-radius: $radius;
    height: $button-height;
    line-height: $button-height;
    padding: 0 $space-base;
  }

  &-full-width {
    display: flex;
    width: 100%;
    height: $button-height;
    line-height: $button-height;
  }

  &-full-height {
    display: inline-flex;
    height: 100%;
    padding: 0 $space-base;
  }

  &-active {
    color: var(--color-primary);
  }

  &-disabled:hover {
    cursor: not-allowed;
    background-color: transparent;
  }
}
</style>
