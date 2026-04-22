<template>
  <div class="dots">
    <div
      v-for="i in total"
      :key="i"
      class="dot"
      :class="{ act: i - 1 === current, done: i - 1 < current }"
    />
  </div>
</template>

<script setup>
defineProps({
  total:   { type: Number, required: true },
  current: { type: Number, required: true }, // 0-indexed
})
</script>
