<script>
export default {
  render(h) {
    // init tag
    const tag = this.$attrs.href ? 'a' : 'button';

    // apply classes and dom props
    const options = {
      class: this.buttonClasses,
      attrs: this.$attrs,
      on: {
        click: this.onClick,
      },
    };
    // only apply disabled prop when it is a button
    if (tag === 'button') {
      options.attrs.disabled = this.disabled;
    }

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

<style lang="scss" src="./GButton.scss">
</style>