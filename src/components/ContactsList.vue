<template>
  <div class="contacts-panel">
    <div class="controls">
      <button :class="{disabled: !btnActive}" class="btn primary" @click="showModal = true">Add contact</button>
      <button :class="{disabled: !btnActive}" class="btn primary" @click="clearAll">Clear all</button>
    </div>
    <div v-if="loading" class="lds-ring">
      <div></div><div></div><div></div>
    </div>
    <div v-else-if="contacts.length === 0">
      No data
    </div>
    <div v-else class="contacts-list">
      <Contact v-for="contact in contacts" v-bind:contact="contact" v-bind:key="contact.id"
               v-on:delete-contact="deleteContact" />
    </div>
    <!--  pass parameters [btn-type, btn-form] for control form submit event  -->
    <AddContactModal v-if="showModal" header="Add new contact" btn-type="submit" btn-form="adding"
                     v-on:close-window="showModal = false" :blocking="blockModal">
      <AddContactForm form-id="adding" v-on:add-contact="addContact" />
    </AddContactModal>
  </div>
</template>

<script>
import Contact from "@/components/Contact";
import AddContactModal from "@/components/ModalWindow";
import AddContactForm from "@/components/AddContactForm";
import {asyncClearAll, asyncDeleteData, asyncLoadData, asyncSave} from "@/utils";
import UserContact from "@/models/UserContact";

const KEY = "contacts";

export default {
  name: "ContactsList",
  components: {AddContactForm, AddContactModal, Contact},
  data: () => ({
    contacts: [],
    showModal: false,
    btnActive: true,
    loading: true,
    blockModal: false,
  }),
  mounted() {
    asyncLoadData(KEY)
      .then(data => this.contacts = data.map(data => new UserContact(data)))
      .catch(e => console.log(e))
      .finally(() => this.loading = false);
  },
  methods: {
    addContact(contact) {
      this.blockModal = true;
      asyncSave(KEY, contact)
          .then(data => this.contacts.push(data))
          .catch(e => console.log(e)) // maybe show notify :)
          .finally(() => this.showModal = this.blockModal = false);
    },
    deleteContact(id, wait) {
      if (!this.btnActive) return; // maybe deleting all is active
      wait(true);
      asyncDeleteData(KEY, id)
        .then(id => this.contacts = this.contacts.filter(item => item.id !== id))
        .catch(message => console.log(message))
        .finally(() => wait(false));
    },
    clearAll() {
      this.btnActive = false;
      asyncClearAll()
        .then(() => this.contacts = [])
        .finally(() => this.btnActive = true);
    },
  }
}
</script>

<style scoped>

</style>