<template>
  <form method="post" @submit.prevent="onSubmit" v-bind:id="formId">
    <AddContactFormControl v-model="name" :validator="validateNameInput" label="Name" />
    <AddContactFormControl v-model="surname" :validator="validateNameInput" label="Surname" />
    <AddContactFormControl v-model="phone" :validator="validatePhoneInput" label="Phone" />
    <AddContactFormControl v-model="email" :validator="validateEmailInput" label="Email" />
  </form>
</template>

<script>
import UserContact from "@/models/UserContact";
import AddContactFormControl from "@/components/AddContactFormControl";
import {validatePhone, validateName, validateEmail} from "@/validators";

export default {
  name: "AddContactForm",
  components: {AddContactFormControl},
  data: () => ({
    name: '',
    surname: '',
    phone: '',
    email: ''
  }),
  props: {
    formId: {
      type: String,
      required: false
    }
  },
  methods: {
    onSubmit() {
      if (validateName(this.name) && validateName(this.surname)
          && validatePhone(this.phone) && validateEmail(this.email)) {
        const contact = new UserContact({
          name: this.name,
          surname: this.surname,
          phone: this.phone,
          email: this.email,
        });
        this.$emit('add-contact', contact);
      }
    },
    validateEmailInput(email) {
      if (!email) return null;
      return validateEmail(email)
    },
    validatePhoneInput(phone) {
      if (!phone) return null;
      return validatePhone(phone)
    },
    validateNameInput(name) {
      if (!name) return null;
      return validateName(name)
    },
  }
}
</script>