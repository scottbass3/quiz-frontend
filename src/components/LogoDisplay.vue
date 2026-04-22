<template>
  <div style="display:flex;align-items:baseline;gap:1px;">
    <span
      v-for="(letter, i) in letters"
      :key="i"
      :style="{
        fontFamily: '\'Fredoka One\', cursive',
        fontSize: fontSize + 'px',
        color: colors[i % colors.length],
        WebkitTextStroke: stroke + ' #1c1917',
        lineHeight: 1,
      }"
    >{{ letter }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: String, default: 'lg' } // sm | md | lg | xl
})

const letters = 'QUIZZ'.split('')
const colors  = ['#f97316', '#ef4444', '#fbbf24', '#22c55e', '#8b5cf6']

const fontSize = computed(() => ({ sm: 32, md: 48, lg: 72, xl: 96 }[props.size] ?? 72))
const stroke   = computed(() => ({ sm: '2px', md: '2px', lg: '3px', xl: '4px' }[props.size] ?? '3px'))
</script>
