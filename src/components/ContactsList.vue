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
    <ModalWindow v-if="showModal" header="Add new contact" btn-type="submit" btn-form="adding"
                     v-on:close-window="showModal = false" :blocking="blockModal">
      <AddContactForm form-id="adding" v-on:add-contact="addContact" />
    </ModalWindow>
    <ModalWindow v-if="confirmAction !== null" :header="confirmHeader" v-on:accept-window="confirmModal"
                 v-on:close-window="closeModal" />
  </div>
</template>

<script>
import Contact from "@/components/Contact";
import AddContactForm from "@/components/AddContactForm";
import {asyncClearAll, asyncDeleteData, asyncLoadData, asyncSave} from "@/utils";
import UserContact from "@/models/UserContact";
import ModalWindow from "@/components/ModalWindow";

const KEY = "contacts";

export default {
  name: "ContactsList",
  components: {ModalWindow, AddContactForm, Contact},
  data: () => ({
    contacts: [],
    showModal: false,
    btnActive: true,
    loading: true,
    blockModal: false,
    confirmAction: null,
    confirmCloseAction: null,
    confirmHeader: ''
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
          .finally(() => this.showModal = this.blockModal = false);
    },
    deleteContact(id, end) {
      if (!this.btnActive) return; // maybe deleting all is active
      this.confirmHeader = 'You want to delete this contact?';
      this.confirmCloseAction = () => end();
      this.confirmAction = () => asyncDeleteData(KEY, id)
        .then(id => this.contacts = this.contacts.filter(item => item.id !== id))
        .finally(() => end());
    },
    clearAll() {
      this.btnActive = false;
      this.confirmHeader = 'You want to clear all contacts?';
      this.confirmCloseAction = () => this.btnActive = true;
      this.confirmAction = () => asyncClearAll()
        .then(() => this.contacts = [])
        .finally(() => this.btnActive = true);
    },
    /**
     * Click accept in ModalWindow
     */
    confirmModal() {
      if (this.confirmAction) {
        this.confirmAction();
        this.resetModalActions();
      }
    },
    /**
     * Click close in ModalWindow
     */
    closeModal() {
      if (this.confirmCloseAction) {
        this.confirmCloseAction();
      }
      this.resetModalActions();
    },
    /**
     * Reset all variables used by modal window
     */
    resetModalActions() {
      this.confirmCloseAction = null;
      this.confirmAction = null;
      this.confirmHeader = '';
    },
  }
}
</script>

<style scoped>

</style>