<template>
  <div>
    <TransitionGroup name="plist" tag="div">
      <div v-for="(player, idx) in players" :key="player.id" class="prow">
        <div class="av" :style="{ background: avatarColor(player), color: '#fff' }">
          {{ initials(player.name || player.id) }}
        </div>
        <span style="font-family:'Nunito',sans-serif;font-weight:800;font-size:16px;flex:1;color:#1c1917;">
          {{ player.name || player.id }}
        </span>
        <span v-if="player.id === currentPlayerId" class="badge" style="background:#fde8c8;font-size:11px;">Toi</span>
        <span v-if="idx === 0 && showHost" class="badge" style="background:#fde8c8;font-size:11px;">👑 Hôte</span>
        <LivesDisplay v-if="showLives && !player.eliminated" :lives="player.lives ?? 3" :max="3" size="sm" />
        <span v-else-if="player.eliminated" style="font-size:20px;">💀</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import LivesDisplay from './LivesDisplay.vue'

const AV_COLORS = ['#f97316','#ef4444','#8b5cf6','#3b82f6','#22c55e','#ec4899','#fbbf24']

const props = defineProps({
  players:         { type: Array,   required: true },
  currentPlayerId: { type: String,  default: null },
  showLives:       { type: Boolean, default: false },
  showHost:        { type: Boolean, default: false },
})

function initials(name) { return (name || '?').slice(0, 1).toUpperCase() }
function avatarColor(player) {
  const name = player.name || player.id || ''
  return AV_COLORS[name.charCodeAt(0) % AV_COLORS.length]
}
</script>

<style scoped>
.plist-enter-active { transition: all .3s ease; }
.plist-leave-active { transition: all .3s ease; }
.plist-enter-from   { opacity: 0; transform: translateX(-10px); }
.plist-leave-to     { opacity: 0; transform: translateX(10px); }
</style>
