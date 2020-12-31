<template>
  <div class="editable-pair">
    <div class="default-editable-pair-view">
      <div class="editable-content">
        <span class="name">{{$props.name}}</span>:
        <input v-if="editing" type="text" v-model="value">
        <span v-else class="value">{{$props.value}}</span>
      </div>
      <button v-if="editing" class="btn danger" @click="editing=false">Cancel</button>
      <button v-else class="btn success" @click="editing=true">Edit</button>
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
  }
}
</script>

<style scoped>
  .default-editable-pair-view {
    display: flex;
    align-items: center;
  }

  .editable-content {
    flex: 1;
  }
</style>