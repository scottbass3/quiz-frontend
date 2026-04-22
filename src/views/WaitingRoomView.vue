<template>
  <div class="phone">
    <div class="screen" style="padding:32px 20px;display:flex;flex-direction:column;gap:20px;min-height:100dvh;">

      <!-- Header -->
      <div style="text-align:center;">
        <LogoDisplay size="md" />
        <div style="margin-top:8px;">
          <span class="badge" style="background:#dcfce7;">🟢 Salle d'attente</span>
        </div>
      </div>

      <!-- Game code card -->
      <div class="card" style="background:#fbbf24;text-align:center;padding:18px 20px;">
        <p style="font-family:'Fredoka One',cursive;font-size:13px;color:#1c1917;opacity:.65;margin-bottom:4px;">CODE DE LA PARTIE</p>
        <p style="font-family:'Fredoka One',cursive;font-size:28px;color:#1c1917;letter-spacing:4px;word-break:break-all;">{{ shortId }}</p>
        <button
          style="margin-top:8px;background:none;border:2px solid #1c1917;border-radius:8px;padding:6px 18px;font-family:'Nunito',sans-serif;font-weight:800;font-size:14px;cursor:pointer;color:#1c1917;"
          @click="copyId"
        >
          {{ copied ? '✅ Copié !' : '📋 Copier' }}
        </button>
      </div>

      <!-- Players list -->
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <h3 style="font-family:'Fredoka One',cursive;font-size:20px;color:#1c1917;">Joueurs</h3>
          <span class="badge" style="background:#fde8c8;">{{ players.length }} / 8</span>
        </div>
        <div v-if="players.length === 0" style="text-align:center;padding:16px 0;font-family:'Nunito',sans-serif;font-weight:700;color:#57534e;opacity:.6;">
          En attente de joueurs…
        </div>
        <PlayerList
          :players="players"
          :current-player-id="playerStore.playerId"
          :show-host="true"
        />
        <div style="display:flex;align-items:center;gap:6px;margin-top:12px;padding-top:10px;border-top:2px dashed #fde8c8;">
          <div style="width:8px;height:8px;border-radius:50%;background:#22c55e;animation:heartBeat 1.2s ease infinite;"/>
          <span style="font-family:'Nunito',sans-serif;font-size:12px;color:#57534e;opacity:.6;">Actualisation toutes les 3s</span>
        </div>
      </div>

      <!-- Waiting / Start -->
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;flex:1;justify-content:center;">
        <div class="spin"/>
        <p style="font-family:'Nunito',sans-serif;font-weight:700;font-size:15px;color:#57534e;text-align:center;">
          {{ playerStore.isAdmin ? 'Prêt à lancer la partie ?' : 'En attente que l\'hôte lance la partie…' }}
        </p>
        <button
          v-if="playerStore.isAdmin"
          class="btn btn-orange"
          style="max-width:300px;"
          :disabled="!canStart || starting"
          @click="handleStart"
        >
          {{ starting ? '…' : '▶ Lancer la partie' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { getGame, startGame } from '@/services/api'
import { QuizWebSocket } from '@/services/websocket'
import LogoDisplay from '@/components/LogoDisplay.vue'
import PlayerList from '@/components/PlayerList.vue'

const route       = useRoute()
const router      = useRouter()
const playerStore = usePlayerStore()
const gameStore   = useGameStore()

const gameId  = route.params.id
const players = ref([])
const starting = ref(false)
const copied  = ref(false)
let ws = null
let pollInterval = null

const shortId  = computed(() => (gameId || '').slice(0, 12))
const canStart = computed(() => players.value.length >= 1)

async function fetchPlayers() {
  try {
    const data = await getGame(gameId)
    players.value = data.players ?? []
    gameStore.setPlayers(players.value)
  } catch {}
}

async function handleStart() {
  starting.value = true
  try {
    await startGame(gameId)
    router.push(`/games/${gameId}/play`)
  } catch {
    starting.value = false
  }
}

function copyId() {
  navigator.clipboard.writeText(gameId).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

onMounted(() => {
  if (!gameStore.gameId) gameStore.setGame(gameId)
  fetchPlayers()
  pollInterval = setInterval(fetchPlayers, 3000)

  ws = new QuizWebSocket(gameId, playerStore.playerId)
  ws.on('game_joined', data => gameStore.onGameJoined(data))
  ws.on('question_started', () => router.push(`/games/${gameId}/play`))
  ws.connect()
})

onUnmounted(() => {
  clearInterval(pollInterval)
  ws?.disconnect()
})
</script>
