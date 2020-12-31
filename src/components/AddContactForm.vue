<template>
  <form method="post" @submit.prevent="onSubmit" v-bind:id="formId">
    <InputFormControl v-model="name" :validator="validateNameInput" label="Name" />
    <InputFormControl v-model="surname" :validator="validateNameInput" label="Surname" />
    <InputFormControl v-model="phone" :validator="validatePhoneInput" label="Phone" />
    <InputFormControl v-model="email" :validator="validateEmailInput" label="Email" />
  </form>
</template>

<script>
import UserContact from "@/models/UserContact";
import InputFormControl from "@/components/InputFormControl";
import {validatePhone, validateName, validateEmail} from "@/validators";

export default {
  name: "AddContactForm",
  components: {InputFormControl},
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