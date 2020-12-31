<template>
  <div class="editable-pair">
    <div class="default-editable-pair-view">
      <div class="editable-content">
        <span class="name">{{$props.name}}</span>:
        <input v-if="editing" type="text" ref="valInput" :value="value">
        <span v-else class="value">{{$props.value}}</span>
      </div>
      <div v-if="editing" class="edt-ctr">
        <button class="btn success" @click="acceptEdit">
          Accept
        </button>
        <button class="btn danger" @click="onCloseEdit">Cancel</button>
      </div>
      <button  v-else class="btn success edt-ctr" @click="editing=true">Edit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditablePair",
  data: () => ({
    editing: false
  }),
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    acceptEdit() {
      this.$emit('save-state', this.name, this.$refs.valInput.value, () => this.editing = false)
    },
    onCloseEdit() {
      this.$emit('close-edit', () => this.editing = false);
    }
  }
}
</script>

<style scoped>
  .default-editable-pair-view {
    display: flex;
    align-items: center;
  }

  .edt-ctr {
    margin-left: auto;
  }

  .editable-content {
    flex: 1;
  }
</style>