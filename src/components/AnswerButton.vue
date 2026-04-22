<template>
  <button
    class="opt"
    :class="stateClass"
    :disabled="disabled"
    @click="!disabled && $emit('select', option.id)"
  >
    <div class="opt-lbl">{{ label }}</div>
    <span style="flex:1;">{{ option.text }}</span>
    <span v-if="showIcon" style="margin-left:auto;font-size:20px;">
      {{ isCorrect ? '✓' : '✗' }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  option:    { type: Object,  required: true },
  label:     { type: String,  required: true },
  selected:  { type: Boolean, default: false },
  correctId: { type: String,  default: null },
  disabled:  { type: Boolean, default: false },
})
defineEmits(['select'])

const isRevealed = computed(() => props.correctId !== null)
const isCorrect  = computed(() => isRevealed.value && props.option.id === props.correctId)
const isWrong    = computed(() => isRevealed.value && props.selected && !isCorrect.value)

const stateClass = computed(() => {
  if (isCorrect.value) return 'correct'
  if (isWrong.value)   return 'wrong'
  if (props.selected)  return 'sel'
  if (isRevealed.value && !isCorrect.value) return 'dimmed'
  return ''
})

const showIcon = computed(() => isRevealed.value && (isCorrect.value || isWrong.value))
</script>
