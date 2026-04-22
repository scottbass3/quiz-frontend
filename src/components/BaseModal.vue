<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" style="position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:padding:16px;">
        <div
          style="position:absolute;inset:0;background:rgba(28,25,23,.55);"
          @click="$emit('close')"
        />
        <div class="card" style="position:relative;width:100%;max-width:400px;margin:auto;animation:bounceIn .3s ease;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
            <h2 style="font-family:'Fredoka One',cursive;font-size:22px;color:#1c1917;">{{ title }}</h2>
            <button class="back-btn" style="font-size:20px;" @click="$emit('close')">✕</button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ open: { type: Boolean, required: true }, title: { type: String, required: true } })
defineEmits(['close'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
</style>
