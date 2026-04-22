<template>
  <TransitionGroup tag="div" name="feed" style="display:flex;flex-direction:column;gap:8px;pointer-events:none;">
    <div
      v-for="event in events"
      :key="event.id"
      class="badge"
      style="background:#fee2e2;border-color:#ef4444;box-shadow:2px 2px 0 #ef4444;font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;"
    >
      💀 {{ event.name }} éliminé·e !
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  eliminated: { type: Array, default: () => [] },
})

const events = ref([])
let counter = 0

watch(() => props.eliminated, (newList, oldList) => {
  const oldIds = new Set((oldList || []).map(p => p.id))
  newList.forEach(player => {
    if (!oldIds.has(player.id)) {
      const id = counter++
      events.value.push({ id, name: player.name || player.id })
      setTimeout(() => { events.value = events.value.filter(e => e.id !== id) }, 4000)
    }
  })
}, { deep: true })
</script>

<style scoped>
.feed-enter-active { transition: all .3s ease; }
.feed-leave-active { transition: all .5s ease; }
.feed-enter-from   { opacity: 0; transform: translateX(20px); }
.feed-leave-to     { opacity: 0; transform: translateX(20px); }
</style>
