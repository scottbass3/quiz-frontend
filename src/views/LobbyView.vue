<template>
  <div class="phone">
    <div class="screen" style="padding:32px 24px;display:flex;flex-direction:column;gap:22px;min-height:100dvh;">

      <!-- Back -->
      <button class="back-btn" @click="$router.push('/')">← Retour</button>

      <!-- Logo + title -->
      <div style="text-align:center;">
        <LogoDisplay size="md" />
        <h2 style="font-family:'Fredoka One',cursive;font-size:26px;color:#1c1917;margin-top:10px;">Lobby</h2>
        <p style="font-family:'Nunito',sans-serif;font-weight:700;font-size:15px;color:#57534e;margin-top:2px;">
          Rejoins une partie ou crée la tienne
        </p>
      </div>

      <!-- Join by ID -->
      <div class="card">
        <h3 style="font-family:'Fredoka One',cursive;font-size:18px;color:#1c1917;margin-bottom:12px;">Rejoindre par ID</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <input
            v-model="joinId"
            class="inp code"
            placeholder="ID DE PARTIE"
            autocomplete="off"
            :class="{ error: joinError }"
            @keydown.enter="handleJoinById"
          />
          <div v-if="joinError" style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;">⚠️</span>
            <p style="font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;color:#ef4444;">{{ joinError }}</p>
          </div>
          <button class="btn btn-orange" :disabled="!joinId.trim() || joining" @click="handleJoinById">
            {{ joining ? '...' : '🚀 Rejoindre' }}
          </button>
        </div>
      </div>

      <!-- Public games -->
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <h3 style="font-family:'Fredoka One',cursive;font-size:18px;color:#1c1917;">Parties ouvertes</h3>
          <div style="display:flex;gap:8px;align-items:center;">
            <span v-if="games.length" class="badge" style="background:#fde8c8;">{{ games.length }}</span>
            <button class="btn btn-white btn-sm btn-icon" :disabled="loading" @click="refreshGames">⟳</button>
          </div>
        </div>

        <div v-if="loading" style="display:flex;flex-direction:column;gap:10px;">
          <div v-for="i in 2" :key="i" style="height:72px;background:#fde8c8;border:2.5px solid #1c1917;border-radius:16px;opacity:.5;"/>
        </div>
        <div v-else-if="games.length === 0" class="card" style="text-align:center;padding:32px 20px;">
          <div style="font-size:40px;margin-bottom:8px;">🎮</div>
          <p style="font-family:'Nunito',sans-serif;font-weight:700;font-size:15px;color:#57534e;">Aucune partie ouverte.</p>
        </div>
        <div v-else style="display:flex;flex-direction:column;gap:10px;">
          <GameCard v-for="game in games" :key="game.id" :game="game" @join="handleJoinGame(game.id)" />
        </div>
      </div>

      <!-- Admin panel -->
      <template v-if="playerStore.isAdmin">
        <div class="card" style="border-color:#f97316;box-shadow:4px 4px 0 #f97316;">
          <h3 style="font-family:'Fredoka One',cursive;font-size:18px;color:#1c1917;margin-bottom:12px;">⚙️ Créer une partie</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div>
              <label style="font-family:'Fredoka One',cursive;font-size:14px;color:#57534e;display:block;margin-bottom:6px;">Liste de questions</label>
              <select v-model="selectedListId" class="inp" style="font-size:16px;cursor:pointer;">
                <option value="" disabled>Choisir une liste…</option>
                <option v-for="list in questionLists" :key="list.id" :value="list.id">{{ list.name }}</option>
              </select>
            </div>
            <button class="btn btn-orange" :disabled="!selectedListId || creatingGame" @click="handleCreateGame">
              {{ creatingGame ? 'Création…' : '+ Créer la partie' }}
            </button>
          </div>
        </div>

        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <h3 style="font-family:'Fredoka One',cursive;font-size:18px;color:#1c1917;">Mes listes</h3>
            <button class="btn btn-white btn-sm btn-icon" @click="showCreateList = true">+ Nouvelle</button>
          </div>
          <div v-if="questionLists.length === 0" style="font-family:'Nunito',sans-serif;font-size:14px;color:#57534e;opacity:.6;padding:8px 0;">
            Aucune liste créée.
          </div>
          <div v-for="list in questionLists" :key="list.id" class="prow">
            <span style="font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;flex:1;color:#1c1917;">{{ list.name }}</span>
            <span class="badge" :style="list.visibility === 'public' ? 'background:#dcfce7;' : 'background:#fde8c8;'">
              {{ list.visibility }}
            </span>
          </div>
        </div>
      </template>

      <!-- Spacer for footer breathing room -->
      <div style="height:16px;"/>
    </div>

    <!-- Create list modal -->
    <BaseModal :open="showCreateList" title="Nouvelle liste" @close="showCreateList = false">
      <form @submit.prevent="handleCreateList" style="display:flex;flex-direction:column;gap:14px;">
        <div>
          <label style="font-family:'Fredoka One',cursive;font-size:15px;color:#1c1917;display:block;margin-bottom:6px;">Nom</label>
          <input v-model="newList.name" class="inp" placeholder="Culture générale…" required />
        </div>
        <div>
          <label style="font-family:'Fredoka One',cursive;font-size:15px;color:#1c1917;display:block;margin-bottom:6px;">Visibilité</label>
          <select v-model="newList.visibility" class="inp" style="cursor:pointer;">
            <option value="public">Publique</option>
            <option value="private">Privée</option>
          </select>
        </div>
        <p v-if="createListError" style="font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;color:#ef4444;">{{ createListError }}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <button type="button" class="btn btn-white" @click="showCreateList = false">Annuler</button>
          <button type="submit" class="btn btn-orange" :disabled="creatingList">
            {{ creatingList ? '…' : 'Créer' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { getPublicLists, createGame, joinGame, createList } from '@/services/api'
import LogoDisplay from '@/components/LogoDisplay.vue'
import GameCard from '@/components/GameCard.vue'
import BaseModal from '@/components/BaseModal.vue'

const router      = useRouter()
const playerStore = usePlayerStore()
const gameStore   = useGameStore()

const games         = ref([])
const questionLists = ref([])
const loading       = ref(false)
const joining       = ref(false)
const joinId        = ref('')
const joinError     = ref('')
const selectedListId = ref('')
const creatingGame  = ref(false)

const showCreateList  = ref(false)
const creatingList    = ref(false)
const createListError = ref('')
const newList = ref({ name: '', visibility: 'public' })

async function refreshGames() {
  loading.value = true
  try {
    const data = await getPublicLists()
    questionLists.value = Array.isArray(data) ? data : (data.lists ?? [])
    games.value = []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function handleJoinById() {
  if (!joinId.value.trim()) return
  joinError.value = ''
  joining.value = true
  try {
    await joinGame(joinId.value.trim())
    gameStore.setGame(joinId.value.trim())
    playerStore.resetGameState()
    router.push(`/games/${joinId.value.trim()}/waiting`)
  } catch (err) {
    joinError.value = err.response?.data?.error || 'Impossible de rejoindre. Vérifie l\'ID.'
  } finally {
    joining.value = false
  }
}

async function handleJoinGame(gameId) {
  joining.value = true
  joinError.value = ''
  try {
    await joinGame(gameId)
    gameStore.setGame(gameId)
    playerStore.resetGameState()
    router.push(`/games/${gameId}/waiting`)
  } catch (err) {
    joinError.value = err.response?.data?.error || 'Impossible de rejoindre.'
  } finally {
    joining.value = false
  }
}

async function handleCreateGame() {
  if (!selectedListId.value) return
  creatingGame.value = true
  try {
    const game = await createGame(selectedListId.value)
    const gameId = game.id ?? game.game_id
    await joinGame(gameId)
    gameStore.setGame(gameId)
    playerStore.resetGameState()
    router.push(`/games/${gameId}/waiting`)
  } catch (err) {
    console.error(err)
  } finally {
    creatingGame.value = false
  }
}

async function handleCreateList() {
  createListError.value = ''
  creatingList.value = true
  try {
    const list = await createList(newList.value)
    questionLists.value.push(list)
    showCreateList.value = false
    newList.value = { name: '', visibility: 'public' }
  } catch (err) {
    createListError.value = err.response?.data?.error || 'Erreur lors de la création.'
  } finally {
    creatingList.value = false
  }
}

onMounted(refreshGames)
</script>
