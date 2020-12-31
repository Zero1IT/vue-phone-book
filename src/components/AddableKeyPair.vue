<template>
  <div class="add-key-pair">
    <InputFormControl v-model="name" label="Name" :disabled="blocked" />
    <InputFormControl v-model="value" label="Value" :disabled="blocked" />
    <button class="btn success" :class="{disabled: blocked}"
            @click="blocked ? null : $emit('add-confirm', name, value)">
      Confirm
    </button>
    <button class="btn danger" :class="{disabled: blocked}" @click="blocked ? null : $emit('close-confirm')">
      Close
    </button>
  </div>
</template>

<script>
import InputFormControl from "@/components/InputFormControl";
export default {
  name: "AddableKeyPair",
  components: {InputFormControl},
  data: () => ({
    name: '',
    value: ''
  }),
  props: {
    blocked: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style scoped>
  .add-key-pair {
    display: flex;
  }
</style>