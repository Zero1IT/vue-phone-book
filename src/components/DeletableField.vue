<template>
  <div class="deletable">
    <div class="del-info">
      <slot />
    </div>
    <div class="delete-action">
      <div v-if="deleting === true" class="lds-ripple"><div></div><div></div></div>
      <button v-else class="danger" @click="clickDelete" />
    </div>
  </div>
</template>

<script>
export default {
  name: "DeletableField",
  data: () => ({
    deleting: false
  }),
  props: {
    keyId: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    clickDelete() {
      this.deleting = true;
      this.$emit('delete-event', this.keyId, () => this.deleting = false);
    }
  }
}
</script>

<style scoped>
  .deletable {
    display: flex;
  }

  .del-info {
    flex-grow: 1;
  }

  .delete-action {
    margin-left: 5px;
    align-self: center;
  }

  .delete-action>button {
    border-radius: 50%;
    cursor: pointer;
    padding: 4px 8px;
    outline: none;
  }

  .delete-action>button::before {
    content: 'X';
    color: #fff;
    font-weight: 300;
    font-family: Arial, sans-serif;
  }
</style>