<template>
  <div class="contact-info">
    <h2>Contact info</h2>
    <div class="history-controls" :class="{invisible: this.history.length <= 1}">
      <span class="undo" :class="{unused: this.historyIndex === 0}" @click="undoAction"></span>
      <button class="btn primary" :disabled="this.historyIndex === this.history.length-1"
              :class="{disabled: this.historyIndex === this.history.length-1}" @click="persistState">
        Accept changes
      </button>
      <span class="redo" :class="{unused: this.historyIndex >= this.history.length-1}" @click="redoAction"></span>
    </div>
    <div v-if="loading === true" class="lds-ring">
      <div></div><div></div><div></div>
    </div>
    <div v-if="!historyState()">
      Not found
    </div>
    <div class="contact-container" v-else>
      <div class="user-property-list">
        <DeletableField v-for="(value, name, i) in history[historyIndex].object" :key="i" :key-id="name"
                        v-on:delete-event="deleteProps">
          <div class="user-property">
            <EditablePair :name="name" :value="value" v-on:save-state="updateProperty" v-on:close-edit="closeEdit" />
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
        if (data) {
          this.pushHistory(new UserContact(data));
        }
      })
      .finally(() => this.loading = false);
  },
  methods: {
    /**
     * Push new state to history of actions
     */
    pushHistory(state) {
      if (this.historyIndex !== this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex+1);
      }
      this.history.push(state);
      this.historyIndex = this.history.length - 1;
      return this.history[this.historyIndex];
    },
    historyPop() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        return this.history[this.historyIndex];
      }
      return this.history[this.historyIndex];
    },
    replaceState(state) {
      this.history = [state];
      this.historyIndex = 0;
    },
    historyStepForward() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
      }
    },
    historyState() {
      console.log(this.history[this.historyIndex]);
      return this.history[this.historyIndex];
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
    /**
     * Confirm adding new property
     * @param name - property name
     * @param value - property value
     */
    addConfirm(name, value) {
      this.blocked = true;
      const contact = this.historyState();
      const change = contact.object;
      change[name] = value;
      asyncUpdate(KEY, new UserContact(change))
        .then(current => this.pushHistory(current))
        .finally(() => this.blocked = this.adding = false);
    },
    /**
     * Confirm update property
     * @param name - property name
     * @param value - property value
     * @param endEdit - callback for end editing
     */
    updateProperty(name, value, endEdit) {
      if (name === 'id') {
        endEdit();
        this.confirmHeader = 'You cannot change id field';
        this.confirmAction = () => this.confirmAction = null;
        return;
      }
      this.confirmHeader = 'You want to change this property?';
      this.confirmCloseAction = endEdit;
      this.confirmAction = () => {
        const contact = this.historyState();
        const edited = contact.object;
        edited[name] = value;
        asyncUpdate(KEY, new UserContact(edited))
            .then(current => this.pushHistory(current))
            .finally(endEdit);
      }
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
        const contact = this.historyState();
        const deleted = contact.object;
        delete deleted[propName];
        asyncUpdate(KEY, new UserContact(deleted))
            .then(current => this.pushHistory(current))
            .finally(end);
      }
      this.confirmCloseAction = end;
    },
    undoAction() {
      this.historyPop();
    },
    redoAction() {
      this.historyStepForward();
    },
    persistState() {
      this.confirmHeader = 'Do you want save current state?';
      this.confirmAction = () => {
        asyncUpdate(KEY, this.historyState())
            .then(current => this.replaceState(current));
      }
    },
    closeEdit(close) {
      this.confirmHeader = 'You want to cancel editing?';
      this.confirmAction = close;
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