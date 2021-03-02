<script>
export default {
  render(h) {
    // init tag
    const tag = this.href ? 'a' : 'div';

    // apply classes and dom props
    const options = {
      class: this.buttonClasses,
      attrs: {
        href: this.href,
        // inherit all non-prop attributes
        ...this.$attrs,
      },
      on: {
        click: this.handleClick,
      },
    };

    // if external
    if (this.external) {
      options.attrs.target = '_blank';
      options.attrs.rel = 'noopener';
    }

    const icon = [h('AIconCircle', { class: 'a-spin' })];
    const slot = this.$slots.default;
    return h(tag, options, this.loading ? icon : slot);
  },

  name: 'AButton',

  props: {
    type: {
      type: String,
      validator: (val) => {
        return ['full-width', 'full-height', 'default'].includes(val);
      },
      default: 'default', // common button by default
    },
    href: { type: String },
    active: { type: Boolean },
    disabled: { type: Boolean },
    external: { type: Boolean },
    loading: { type: Boolean },
  },
  computed: {
    buttonClasses() {
      return [
        'a-button',
        `a-button-${this.type}`,
        {
          'a-button-disabled': this.disabled,
          'a-button-active': this.active,
          'a-button-loading': this.loading,
        },
      ];
    },
  },

  methods: {
    handleClick(e) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', e);
      }
    },
  },
};
</script>

<style lang="scss">
.a-button {
  color: var(--color-font);
  background-color: transparent;
  text-align: center;
  user-select: none;

  // icon support
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
