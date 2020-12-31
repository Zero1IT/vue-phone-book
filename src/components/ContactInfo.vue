<template>
  <div class="contact-info">
    <h2>Contact info</h2>
    <div v-if="loading === true" class="lds-ring">
      <div></div><div></div><div></div>
    </div>
    <div v-if="!contact">
      Not found
    </div>
    <div class="contact-container" v-else>
      <div class="user-property-list">
        <DeletableField v-for="(value, name, i) in contact.object" :key="i" :key-id="name"
                        v-on:delete-event="deleteProps">
          <div class="user-property">
            <EditablePair :name="name" :value="value" />
          </div>
        </DeletableField>
      </div>
      <AddableKeyPair v-if="adding" v-on:add-confirm="addConfirm" v-on:close-confirm="closeConfirm" :blocked="blocked"/>
      <button v-else class="btn primary" @click="adding = true">Add field</button>
    </div>
    <ModalWindow v-if="confirmAction !== null" :header="confirmHeader" v-on:accept-window="confirmModal"
                 v-on:close-window="closeModal" />
  </div>
</template>

<script>
import {asyncGetData, asyncUpdate} from "@/utils";
import UserContact from "@/models/UserContact";
import DeletableField from "@/components/DeletableField";
import EditablePair from "@/components/EditablePair";
import AddableKeyPair from "@/components/AddableKeyPair";
import ModalWindow from "@/components/ModalWindow";

const KEY = "contacts";

export default {
  name: "ContactInfo",
  components: {ModalWindow, AddableKeyPair, EditablePair, DeletableField},
  data: () => ({
    contact: null,
    loading: true,
    adding: false,
    blocked: false,
    requiredNotDeletableFields: ['name', 'email', 'surname', 'phone', 'id'],
    history: [],
    historyIndex: 0,
    confirmAction: null,
    confirmHeader: '',
    confirmCloseAction: null,
  }),
  mounted() {
    asyncGetData(KEY, Number(this.$route.params.id))
      .then(data => {
        this.contact = data ? new UserContact(data) : null;
        this.history.push(this.contact);
      })
      .finally(() => this.loading = false);
  },
  methods: {
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
    /**
     * Confirm adding new property
     * @param name - property name
     * @param value - property value
     */
    addConfirm(name, value) {
      this.blocked = true;
      const prev = this.contact.object;
      const change = this.contact.object;
      change[name] = value;
      asyncUpdate(KEY, new UserContact(change))
        .then(current => this.contact = current)
        .catch(() => this.contact = new UserContact(prev))
        .finally(() => this.blocked = this.adding = false);
    },
    /**
     * Close form for adding new property
     */
    closeConfirm() {
      this.confirmHeader = 'You want to close form?';
      this.confirmAction = () => this.adding = false;
    },
    /**
     * Click delete property
     * @param propName - property name
     * @param end - end deleting callback
     */
    deleteProps(propName, end) {
      if (this.requiredNotDeletableFields.includes(propName)) {
        end();
        this.confirmHeader = 'You cannot delete required field';
        this.confirmAction = () => this.confirmAction = null;
        return;
      }
      this.confirmHeader = 'Do you want to delete property?'
      this.confirmAction = () => {
        const prev = this.contact.object;
        const deleted = this.contact.object;
        delete deleted[propName];
        asyncUpdate(KEY, new UserContact(deleted))
            .then(current => this.contact = current)
            .catch(() => this.contact = new UserContact(prev))
            .finally(() => end());
      }
      this.confirmCloseAction = () => end();
    }
  }
}
</script>

<style scoped>
  .contact-container {
    max-width: 600px;
    margin: auto;
  }

  .user-property {
    display: flex;
  }

  .user-property>div {
    flex-grow: 1;
  }
</style>