<!-- modal window for add contact into list -->
<template>
  <transition name="scale" appear>
    <div class="modal-window">
      <div class="modal-header">
        <h3>{{header}}</h3>
      </div>
      <div class="modal-content">
        <slot />
      </div>
      <div class="modal-actions bottom">
        <button class="btn success" @click="btnForm || blocking ? null : $emit('accept-window')"
                v-bind:type="blocking ? '' : btnType" v-bind:form="blocking ? '' : btnForm" :class="{disabled: blocking}">
          Accept
        </button>
        <button class="btn danger" @click="blocking ? null : $emit('close-window')"
                :class="{disabled: blocking}">
          Close
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ModalWindow",
  props: {
    header: {
      type: String,
      required: true
    },
    btnType: {
      type: String,
      required: false
    },
    btnForm: {
      type: String,
      required: false
    },
    blocking: {
      type: Boolean,
      default: false
    },
  }
}
</script>

<!-- only for animation -->
<style scoped>
  .modal-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    max-width: 400px;
    background: #ebebeb;
    border-radius: 12px;
    z-index: 999;
  }

  .modal-header {
    padding: 10px;
  }

  .modal-content {
    padding: 32px;
    position: relative;
  }

  .scale-enter-active,
  .scale-leave-active {
    transition: transform 0.5s;
  }

  .scale-enter,
  .scale-leave-to {
    transform: scale(0);
  }

  .bottom>button {
    margin: 10px;
  }
</style>