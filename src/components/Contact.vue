<template>
  <DeletableField :key-id="$props.contact.id" v-on:delete-event="clickDelete">
    <div class="contact">
      <span class="contact-num">{{$props.contact.id}}</span>
      <router-link :to="'/contact/'+$props.contact.id" class="contact-name">{{$props.contact.fullName}}</router-link>
    </div>
  </DeletableField>
</template>

<script>
import UserContact from "@/models/UserContact";
import DeletableField from "@/components/DeletableField";

export default {
  name: "Contact",
  components: {DeletableField},
  props: {
    contact: {
      type: UserContact,
      required: true
    },
  },
  methods: {
    clickDelete(keyId, callback) {
      this.$emit('delete-contact', keyId, callback);
    }
  }
}
</script>

<style scoped>

</style>