<template>
  <span class="badge" style="background:#fde8c8;">
    👥 {{ count }}<template v-if="total"> / {{ total }}</template>
  </span>
</template>

<script setup>
defineProps({
  count: { type: Number, required: true },
  total: { type: Number, default: null },
})
</script>
