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
        click: this.onClick,
      },
    };

    // if external
    if (this.external) {
      options.attrs.target = '_blank';
      options.attrs.rel = 'noopener';
    }

    const children = this.loading ? [h('VIconCircle')] : this.$slots.default;
    return h(tag, options, children);
  },
  name: 'VButton',
  props: {
    href: String,
    active: Boolean,
    disabled: Boolean,
    external: Boolean,
    loading: Boolean,
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
          'v-button-active': this.active,
          'v-button-loading': this.loading,
        },
      ];
    },
  },
  methods: {
    onClick(e) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', e);
      }
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

  &-loading {
    &:hover {
      cursor: wait;
      background-color: transparent;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .v-icon {
      animation: spin 1s infinite linear;
    }
  }
}
</style>
