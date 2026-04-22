<template>
  <div class="flex items-center gap-3">
    <span class="text-sm text-white/50 font-medium whitespace-nowrap">
      Question {{ current }} / {{ total }}
    </span>
    <div class="flex-1 bg-bg-dark rounded-full h-1.5 overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-quiz-purple to-quiz-pink rounded-full transition-all duration-700 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true }
})

const progress = computed(() =>
  props.total > 0 ? (props.current / props.total) * 100 : 0
)
</script>
