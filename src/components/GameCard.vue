<template>
  <div
    class="card"
    style="cursor:pointer;transition:transform .1s,box-shadow .1s;"
    @click="$emit('join')"
    @mousedown="e => e.currentTarget.style.cssText += ';transform:translate(3px,3px);box-shadow:1px 1px 0 #1c1917'"
    @mouseup="e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }"
    @mouseleave="e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }"
  >
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;">
      <div>
        <p style="font-family:'Nunito',sans-serif;font-weight:800;font-size:17px;color:#1c1917;">
          {{ game.name || `Partie #${shortId}` }}
        </p>
        <p style="font-family:'Nunito',sans-serif;font-size:13px;color:#57534e;margin-top:2px;font-weight:700;">
          ID: {{ shortId }}
        </p>
      </div>
      <span class="badge" :style="statusStyle">{{ statusLabel }}</span>
    </div>
    <div style="display:flex;gap:16px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;color:#57534e;">
      <span>👥 {{ game.player_count ?? game.players?.length ?? 0 }} joueurs</span>
      <span v-if="game.question_count">❓ {{ game.question_count }} questions</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ game: { type: Object, required: true } })
defineEmits(['join'])

const shortId = computed(() => (props.game.id || '').slice(0, 8))

const statusLabel = computed(() => {
  const s = props.game.status
  if (s === 'waiting')     return '🟢 En attente'
  if (s === 'in_progress') return '🟠 En cours'
  if (s === 'completed')   return '🔴 Terminée'
  return '🟢 Ouverte'
})

const statusStyle = computed(() => {
  const s = props.game.status
  if (s === 'in_progress') return 'background:#fde8c8;'
  if (s === 'completed')   return 'background:#fee2e2;'
  return 'background:#dcfce7;'
})
</script>
