<template>
  <div class="form-control">
    <input ref="place" type="text" @input="emmitInput" :placeholder="label" :disabled="disabled">
    <span class="indicator" v-bind:class="{valid: this.valid === true, invalid: this.valid === false}" />
  </div>
</template>

<script>
export default {
  name: "InputFormControl",
  data: () => ({
    valid: null
  }),
  props: {
    label: {
      type: String
    },
    validator: {
      type: Function
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emmitInput() {
      this.valid = this.validator ? this.validator(this.$refs.place.value) : null;
      this.$emit('input', this.$refs.place.value);
    }
  }
}
</script>