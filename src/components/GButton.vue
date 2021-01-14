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
  name: 'GButton',
  props: {
    active: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      validator: (val) => {
        return ['full-width', 'full-height', 'primary'].includes(val); // button type available
      },
      default: 'primary', // common button by default
    },
  },
  computed: {
    buttonClasses() {
      return [
        'g-button',
        `g-button-${this.type}`,
        {
          'g-button-disabled': this.disabled,
        },
        {
          'g-button-active': this.active,
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
.g-button {
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

  &.g-button-primary {
    display: inline-flex;
    border-radius: $radius;
    height: $button-height;
    line-height: $button-height;
    padding: 0 $space-base;
  }

  &.g-button-full-width {
    display: flex;
    width: 100%;
    height: $button-height;
    line-height: $button-height;
  }

  &.g-button-full-height {
    display: inline-flex;
    height: 100%;
    padding: 0 $space-base;
  }

  &.g-button-active {
    color: var(--color-primary);
  }

  &.g-button-disabled:hover {
    cursor: not-allowed;
    background-color: transparent;
  }
}
</style>
