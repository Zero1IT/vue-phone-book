<template>
  <div class="contact">
    <span class="contact-num">{{$props.contact.id}}</span>
    <span class="contact-name">{{$props.contact.fullName}}</span>
    <div class="contact-delete">
      <div v-if="deleting === true" class="lds-ripple"><div></div><div></div></div>
      <button v-else class="danger" @click="clickDelete" />
    </div>
  </div>
</template>

<script>
import UserContact from "@/models/UserContact";

export default {
  name: "Contact",
  data: () => ({
    deleting: false
  }),
  props: {
    contact: {
      type: UserContact,
      required: true
    },
  },
  methods: {
    clickDelete() {
      this.$emit('delete-contact', this.contact.id, (val) => this.deleting = val);
    }
  }
}
</script>

<style scoped>

</style>