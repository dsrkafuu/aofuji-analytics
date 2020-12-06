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

<style lang="scss" src="./GButton.scss">
</style>