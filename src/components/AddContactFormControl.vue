<template>
  <div class="form-control">
    <input id="name" ref="place" type="text" @input="emmitInput" :placeholder="label">
    <span class="indicator" v-bind:class="{valid: this.valid === true, invalid: this.valid === false}" />
  </div>
</template>

<script>
export default {
  name: "AddContactFormControl",
  data: () => ({
    valid: null
  }),
  props: {
    label: {
      type: String
    },
    validator: {
      type: Function
    }
  },
  methods: {
    emmitInput() {
      this.valid = this.validator(this.$refs.place.value);
      this.$emit('input', this.$refs.place.value);
    }
  }
}
</script>