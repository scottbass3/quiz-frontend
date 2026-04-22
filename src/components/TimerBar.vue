<template>
  <div class="tbar">
    <div class="tbar-fill" :style="{ width: pct + '%', background: color }" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'

const props = defineProps({
  dur:     { type: Number, default: 20 },
  running: { type: Boolean, default: false },
})
const emit = defineEmits(['end'])

const pct = ref(100)
let start = null
let iv = null

const color = computed(() => pct.value > 55 ? '#22c55e' : pct.value > 28 ? '#fbbf24' : '#ef4444')

function tick() {
  const elapsed = (Date.now() - start) / 1000
  pct.value = Math.max(0, 100 - (elapsed / props.dur) * 100)
  if (pct.value <= 0) {
    clearInterval(iv)
    iv = null
    emit('end')
  }
}

watch(() => props.running, (val) => {
  clearInterval(iv)
  iv = null
  if (val) {
    pct.value = 100
    start = Date.now()
    iv = setInterval(tick, 60)
  } else {
    pct.value = 100
  }
}, { immediate: true })

onUnmounted(() => clearInterval(iv))
</script>
