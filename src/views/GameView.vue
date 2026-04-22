<template>
  <div class="phone">

    <!-- ── ELIMINATED OVERLAY ─────────────────────────── -->
    <Transition name="modal">
      <div v-if="playerStore.isEliminated && !watchMode"
        style="position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:rgba(28,25,23,.7);padding:24px;">
        <div class="card" style="text-align:center;max-width:340px;width:100%;animation:bounceIn .4s ease;">
          <div style="font-size:72px;margin-bottom:8px;">💀</div>
          <h2 style="font-family:'Fredoka One',cursive;font-size:32px;color:#ef4444;margin-bottom:6px;">Éliminé·e !</h2>
          <p style="font-family:'Nunito',sans-serif;font-weight:700;font-size:16px;color:#57534e;margin-bottom:20px;">Tu n'as plus de vies. Tu peux regarder la suite.</p>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <button class="btn btn-white" @click="watchMode = true">👁 Regarder</button>
            <button class="btn btn-red" @click="$router.push('/lobby')">Quitter</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── COUNTDOWN SCREEN ───────────────────────────── -->
    <div v-if="gamePhase === 'countdown'"
      class="screen"
      style="padding:28px 24px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;min-height:100dvh;background:#fff1e6;">

      <div style="width:100%;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <p style="font-family:'Fredoka One',cursive;font-size:13px;color:#57534e;">QUESTION</p>
          <p style="font-family:'Fredoka One',cursive;font-size:22px;color:#1c1917;">{{ gameStore.currentQuestionIndex }} / {{ gameStore.questionCount }}</p>
        </div>
        <LivesDisplay :lives="playerStore.lives" :max="3" />
      </div>

      <ProgressDots v-if="gameStore.questionCount > 0" :total="gameStore.questionCount" :current="gameStore.currentQuestionIndex - 1" />

      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
        <template v-if="countdown > 0">
          <p style="font-family:'Fredoka One',cursive;font-size:18px;color:#57534e;">Prochaine question dans…</p>
          <span :style="{
            fontFamily: '\'Fredoka One\', cursive',
            fontSize: '130px',
            color: '#f97316',
            WebkitTextStroke: '4px #1c1917',
            lineHeight: 1,
            animation: 'cntPulse .85s ease infinite',
          }">{{ countdown }}</span>
        </template>
        <template v-else>
          <div style="font-size:90px;animation:heartBeat .5s ease infinite;">❓</div>
          <p style="font-family:'Fredoka One',cursive;font-size:24px;color:#f97316;">C'est parti !</p>
        </template>
      </div>

      <p style="font-family:'Nunito',sans-serif;font-weight:700;font-size:13px;color:#57534e;opacity:.5;text-align:center;">
        Prépare-toi à répondre vite !
      </p>
    </div>

    <!-- ── QUESTION SCREEN ────────────────────────────── -->
    <div v-else-if="gamePhase === 'question'"
      class="screen"
      style="padding:22px 20px;display:flex;flex-direction:column;gap:18px;min-height:100dvh;">

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <p style="font-family:'Fredoka One',cursive;font-size:13px;color:#57534e;">QUESTION {{ gameStore.currentQuestionIndex }} / {{ gameStore.questionCount }}</p>
        </div>
        <LivesDisplay :lives="playerStore.lives" :max="3" />
      </div>

      <TimerBar :dur="20" :running="gameStore.phase === 'question_active' && !gameStore.answerSubmitted" @end="() => {}" />

      <!-- Category badge -->
      <div v-if="gameStore.currentQuestion?.category">
        <span class="badge" style="background:#fff;font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;padding:6px 14px;">
          {{ gameStore.currentQuestion.category }}
        </span>
      </div>

      <!-- Question card -->
      <div class="card" style="background:#f97316;padding:20px 18px;">
        <p style="font-family:'Fredoka One',cursive;font-size:22px;color:#fff;line-height:1.35;text-shadow:0 1px 0 rgba(0,0,0,.15);">
          {{ gameStore.currentQuestion?.text }}
        </p>
      </div>

      <!-- Answer options -->
      <div style="display:flex;flex-direction:column;gap:11px;">
        <AnswerButton
          v-for="(option, idx) in (gameStore.currentQuestion?.options ?? [])"
          :key="option.id"
          :option="option"
          :label="LABELS[idx]"
          :selected="gameStore.selectedOptionId === option.id"
          :correct-id="gameStore.correctOptionId"
          :disabled="gameStore.answerSubmitted || gameStore.phase !== 'question_active'"
          @select="handleSelect"
        />
      </div>

      <!-- Admin close -->
      <div v-if="playerStore.isAdmin && gameStore.phase === 'question_active'" style="display:flex;justify-content:flex-end;">
        <button class="btn btn-red btn-sm btn-icon" :disabled="closingQuestion" @click="handleCloseQuestion">
          {{ closingQuestion ? '…' : '⏹ Fermer la question' }}
        </button>
      </div>
    </div>

    <!-- ── ANSWER SUBMITTED SCREEN ────────────────────── -->
    <div v-else-if="gamePhase === 'submitted'"
      class="screen"
      style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;min-height:100dvh;background:#fff1e6;">

      <LivesDisplay :lives="playerStore.lives" :max="3" />
      <div style="text-align:center;">
        <div style="font-size:80px;margin-bottom:8px;">⏳</div>
        <h2 style="font-family:'Fredoka One',cursive;font-size:30px;color:#1c1917;">Réponse envoyée !</h2>
        <p style="font-family:'Nunito',sans-serif;font-weight:700;font-size:16px;color:#57534e;margin-top:6px;">
          En attente des autres joueurs… ({{ gameStore.submittedAnswers.length }} / {{ gameStore.players.length }})
        </p>
      </div>
      <div class="spin"/>
      <div class="card" style="width:100%;max-width:340px;background:#fbbf24;">
        <p style="font-family:'Fredoka One',cursive;font-size:13px;color:#1c1917;opacity:.65;margin-bottom:4px;">TA RÉPONSE</p>
        <p style="font-family:'Nunito',sans-serif;font-weight:900;font-size:18px;color:#1c1917;">
          {{ selectedOptionText || '—' }}
        </p>
      </div>
    </div>

    <!-- ── QUESTION RESULTS SCREEN ────────────────────── -->
    <div v-else-if="gamePhase === 'results'"
      class="screen"
      style="padding:24px 20px;display:flex;flex-direction:column;gap:18px;min-height:100dvh;">

      <ConfettiEffect :active="myResultCorrect" />

      <!-- Result banner -->
      <div class="card" :style="{ background: myResultCorrect ? '#dcfce7' : '#fee2e2', textAlign: 'center', padding: '22px 20px' }">
        <div style="font-size:60px;">{{ myResultCorrect ? '🎉' : '💔' }}</div>
        <h2 :style="{ fontFamily: '\'Fredoka One\', cursive', fontSize: '30px', color: myResultCorrect ? '#16a34a' : '#dc2626', marginTop: '4px' }">
          {{ myResultCorrect ? 'Bonne réponse !' : 'Raté !' }}
        </h2>
        <p v-if="!myResultCorrect" style="font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;color:#dc2626;margin-top:4px;">−1 vie</p>
      </div>

      <div style="display:flex;justify-content:center;">
        <LivesDisplay :lives="playerStore.lives" :max="3" />
      </div>

      <!-- Answer reveal -->
      <div>
        <p style="font-family:'Fredoka One',cursive;font-size:14px;color:#57534e;margin-bottom:8px;">BONNE RÉPONSE</p>
        <div style="display:flex;flex-direction:column;gap:9px;">
          <AnswerButton
            v-for="(option, idx) in (gameStore.currentQuestion?.options ?? [])"
            :key="option.id"
            :option="option"
            :label="LABELS[idx]"
            :selected="gameStore.selectedOptionId === option.id"
            :correct-id="gameStore.correctOptionId"
            :disabled="true"
            @select="() => {}"
          />
        </div>
      </div>

      <!-- Player board -->
      <div class="card">
        <h3 style="font-family:'Fredoka One',cursive;font-size:18px;color:#1c1917;margin-bottom:8px;">Joueurs</h3>
        <div v-for="p in gameStore.players" :key="p.id" class="prow">
          <div class="av" :style="{ background: avColor(p), color: '#fff' }">{{ (p.name || p.id || '?')[0].toUpperCase() }}</div>
          <span style="font-family:'Nunito',sans-serif;font-weight:800;flex:1;font-size:15px;color:#1c1917;">{{ p.name || p.id }}</span>
          <LivesDisplay :lives="p.lives ?? 3" :max="3" size="sm" />
        </div>
      </div>

      <!-- Next / Close -->
      <div v-if="playerStore.isAdmin" style="display:flex;flex-direction:column;gap:10px;">
        <button class="btn btn-orange" @click="handleNextQuestion">
          {{ gameStore.currentQuestionIndex >= gameStore.questionCount ? '🏆 Résultats finaux' : '➡ Question suivante' }}
        </button>
      </div>
      <div v-else style="text-align:center;font-family:'Nunito',sans-serif;font-weight:700;font-size:14px;color:#57534e;opacity:.7;">
        En attente de la prochaine question…
      </div>
    </div>

    <!-- ── WAITING FOR QUESTION ────────────────────────── -->
    <div v-else
      class="screen"
      style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;min-height:100dvh;">
      <div class="spin"/>
      <p style="font-family:'Nunito',sans-serif;font-weight:700;font-size:16px;color:#57534e;">En attente de la question…</p>
    </div>

    <!-- Elimination feed fixed overlay -->
    <div style="position:fixed;top:16px;right:16px;z-index:30;width:220px;">
      <EliminationFeed :eliminated="eliminatedPlayers" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { getGame, closeQuestion } from '@/services/api'
import { QuizWebSocket } from '@/services/websocket'
import LivesDisplay from '@/components/LivesDisplay.vue'
import AnswerButton from '@/components/AnswerButton.vue'
import TimerBar from '@/components/TimerBar.vue'
import ProgressDots from '@/components/ProgressDots.vue'
import ConfettiEffect from '@/components/ConfettiEffect.vue'
import EliminationFeed from '@/components/EliminationFeed.vue'

const LABELS   = ['A', 'B', 'C', 'D']
const AV_COLS  = ['#f97316','#ef4444','#8b5cf6','#3b82f6','#22c55e','#ec4899','#fbbf24']
const avColor  = p => AV_COLS[(p.name || p.id || '').charCodeAt(0) % AV_COLS.length]

const route       = useRoute()
const router      = useRouter()
const playerStore = usePlayerStore()
const gameStore   = useGameStore()

const gameId         = route.params.id
const closingQuestion = ref(false)
const watchMode      = ref(false)
const countdown      = ref(0)
let countdownTimer   = null
let ws = null

// Which sub-screen to show
const gamePhase = computed(() => {
  if (!gameStore.currentQuestion) return 'idle'
  if (gameStore.phase === 'question_active') {
    return gameStore.answerSubmitted ? 'submitted' : 'question'
  }
  if (gameStore.phase === 'question_closed') return 'results'
  if (gameStore.phase === 'waiting') return 'countdown'
  return 'idle'
})

const eliminatedPlayers = computed(() =>
  gameStore.players.filter(p => gameStore.eliminatedPlayerIds.has(p.id))
)

const selectedOptionText = computed(() => {
  if (!gameStore.selectedOptionId || !gameStore.currentQuestion) return null
  return gameStore.currentQuestion.options.find(o => o.id === gameStore.selectedOptionId)?.text
})

const myResultCorrect = computed(() => {
  if (!gameStore.correctOptionId || !gameStore.selectedOptionId) return false
  return gameStore.selectedOptionId === gameStore.correctOptionId
})

function startCountdown() {
  clearTimeout(countdownTimer)
  countdown.value = 3
  const tick = () => {
    if (countdown.value > 0) {
      countdown.value--
      countdownTimer = setTimeout(tick, 900)
    }
  }
  countdownTimer = setTimeout(tick, 900)
}

function handleSelect(optionId) {
  if (gameStore.answerSubmitted || gameStore.phase !== 'question_active') return
  gameStore.selectOption(optionId)
  gameStore.markAnswerSubmitted()
  ws?.submitAnswer(gameStore.currentQuestion.id, optionId)
}

async function handleCloseQuestion() {
  closingQuestion.value = true
  try { await closeQuestion(gameId) } catch { /* ignore */ }
  finally { closingQuestion.value = false }
}

function handleNextQuestion() {
  // Admin starts next question on backend by calling start again or just waiting for WS
  // The WS question_started event will trigger the countdown
}

onMounted(() => {
  if (!gameStore.gameId) gameStore.setGame(gameId)
  getGame(gameId).then(data => gameStore.setPlayers(data.players ?? [])).catch(() => {})

  ws = new QuizWebSocket(gameId, playerStore.playerId)

  ws.on('game_joined', data => gameStore.onGameJoined(data))

  ws.on('question_started', data => {
    gameStore.onQuestionStarted(data)
    closingQuestion.value = false
    // Show countdown before revealing question
    gameStore.phase = 'waiting'
    startCountdown()
    // After 3s reveal question
    setTimeout(() => { gameStore.phase = 'question_active' }, 3200)
  })

  ws.on('answer_submitted', data => gameStore.onAnswerSubmitted(data))

  ws.on('question_closed', data => gameStore.onQuestionClosed(data))

  ws.on('life_lost', data => {
    const remaining = data.lives_remaining ?? data.livesRemaining ?? 0
    playerStore.loseLife(remaining)
  })

  ws.on('player_eliminated', data => {
    gameStore.onPlayerEliminated(data)
    const id = data.player_id ?? data.playerId
    if (id === playerStore.playerId) playerStore.loseLife(0)
  })

  ws.on('game_over', data => {
    gameStore.onGameOver(data)
    router.push(`/games/${gameId}/over`)
  })

  ws.connect()
})

onUnmounted(() => {
  clearTimeout(countdownTimer)
  ws?.disconnect()
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .3s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
</style>
