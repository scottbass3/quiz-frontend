<template>
  <div>
    <div
      v-for="p in pieces"
      :key="p.id"
      class="cf"
      :style="{
        left: p.left + '%',
        background: p.color,
        width: p.sz + 'px',
        height: p.sz + 'px',
        animationDuration: p.dur + 's',
        animationDelay: p.delay + 's',
      }"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: false },
})

const COLS = ['#f97316','#ef4444','#fbbf24','#22c55e','#8b5cf6','#ec4899','#3b82f6']
const pieces = ref([])
let clearTimer = null

watch(() => props.active, (val) => {
  if (!val) return
  clearTimeout(clearTimer)
  pieces.value = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLS[i % COLS.length],
    dur: 1.1 + Math.random() * 1.3,
    delay: Math.random() * 0.6,
    sz: 8 + Math.random() * 8,
  }))
  clearTimer = setTimeout(() => { pieces.value = [] }, 3200)
}, { immediate: true })
</script>
