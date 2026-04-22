<template>
  <div class="phone">
    <div class="screen" style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:22px;min-height:100dvh;">

      <ConfettiEffect :active="true" />

      <LogoDisplay size="lg" />

      <!-- Winner card -->
      <div class="card" style="width:100%;background:#fbbf24;text-align:center;padding:28px 20px;">
        <div style="font-size:68px;">🏆</div>
        <h2 style="font-family:'Fredoka One',cursive;font-size:34px;color:#1c1917;margin-top:6px;">
          {{ isWinner ? 'Tu gagnes !' : `${winnerName} gagne !` }}
        </h2>
        <p v-if="winnerLives !== null" style="font-family:'Nunito',sans-serif;font-weight:700;font-size:15px;color:#57534e;margin-top:4px;">
          Avec {{ winnerLives }} vie{{ winnerLives > 1 ? 's' : '' }} restante{{ winnerLives > 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Standings -->
      <div class="card" style="width:100%;">
        <h3 style="font-family:'Fredoka One',cursive;font-size:20px;color:#1c1917;margin-bottom:10px;">Classement final</h3>
        <div v-for="(player, idx) in sortedPlayers" :key="player.id" class="prow">
          <span style="font-family:'Fredoka One',cursive;font-size:22px;width:34px;">
            {{ MEDALS[idx] ?? (idx + 1) + '.' }}
          </span>
          <div class="av" :style="{ background: avColor(player), color: '#fff' }">
            {{ (player.name || player.id || '?')[0].toUpperCase() }}
          </div>
          <span style="font-family:'Nunito',sans-serif;font-weight:800;flex:1;font-size:16px;color:#1c1917;">
            {{ player.name || player.id }}
            <span v-if="player.id === playerStore.playerId" style="color:#f97316;"> (Toi)</span>
          </span>
          <LivesDisplay :lives="player.lives ?? 0" :max="3" size="sm" />
        </div>
      </div>

      <!-- Actions -->
      <div style="width:100%;display:flex;flex-direction:column;gap:10px;">
        <button class="btn btn-orange" @click="goLobby">🔄 Rejouer</button>
        <button class="btn btn-white" @click="goLobby">🏠 Accueil</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import LogoDisplay from '@/components/LogoDisplay.vue'
import LivesDisplay from '@/components/LivesDisplay.vue'
import ConfettiEffect from '@/components/ConfettiEffect.vue'

const MEDALS   = ['🥇', '🥈', '🥉']
const AV_COLS  = ['#f97316','#ef4444','#8b5cf6','#3b82f6','#22c55e','#ec4899','#fbbf24']
const avColor  = p => AV_COLS[(p.name || p.id || '').charCodeAt(0) % AV_COLS.length]

const router      = useRouter()
const playerStore = usePlayerStore()
const gameStore   = useGameStore()

const isWinner = computed(() => gameStore.winnerId === playerStore.playerId)

const winnerPlayer = computed(() => gameStore.players.find(p => p.id === gameStore.winnerId))
const winnerName   = computed(() => winnerPlayer.value?.name || gameStore.winnerId || '?')
const winnerLives  = computed(() => winnerPlayer.value?.lives ?? null)

const sortedPlayers = computed(() =>
  [...gameStore.players].sort((a, b) => {
    if (a.id === gameStore.winnerId) return -1
    if (b.id === gameStore.winnerId) return 1
    return (b.lives ?? 0) - (a.lives ?? 0)
  })
)

function goLobby() {
  gameStore.reset()
  router.push('/lobby')
}
</script>
