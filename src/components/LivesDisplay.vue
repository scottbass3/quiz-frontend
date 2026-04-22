<template>
  <div style="display:flex;gap:3px;" :aria-label="`${lives} of ${max} lives remaining`">
    <span
      v-for="i in max"
      :key="i"
      class="heart"
      :class="{ lost: i > lives }"
      :style="{ fontSize: sizePx }"
    >❤️</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  lives: { type: Number, required: true },
  max:   { type: Number, default: 3 },
  size:  { type: String, default: 'md' },
})

const sizePx = computed(() => ({ sm: '20px', md: '26px', lg: '32px' }[props.size] ?? '26px'))
</script>
