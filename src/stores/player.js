import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const playerId = ref(localStorage.getItem('quiz_player_id') || '')
  const playerName = ref(localStorage.getItem('quiz_player_name') || '')
  const actorType = ref(localStorage.getItem('quiz_actor_type') || 'user')

  // In-game state
  const lives = ref(3)
  const isEliminated = ref(false)

  const isAdmin = computed(() => actorType.value === 'admin')

  function setIdentity(name, type = 'user') {
    playerName.value = name
    actorType.value = type
    // Use name as the actor ID for the debug headers
    playerId.value = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now()
    localStorage.setItem('quiz_player_id', playerId.value)
    localStorage.setItem('quiz_player_name', playerName.value)
    localStorage.setItem('quiz_actor_type', actorType.value)
  }

  function resetGameState() {
    lives.value = 3
    isEliminated.value = false
  }

  function loseLife(remaining) {
    lives.value = remaining
    if (remaining === 0) {
      isEliminated.value = true
    }
  }

  function clearIdentity() {
    playerId.value = ''
    playerName.value = ''
    actorType.value = 'user'
    localStorage.removeItem('quiz_player_id')
    localStorage.removeItem('quiz_player_name')
    localStorage.removeItem('quiz_actor_type')
  }

  return {
    playerId,
    playerName,
    actorType,
    lives,
    isEliminated,
    isAdmin,
    setIdentity,
    resetGameState,
    loseLife,
    clearIdentity
  }
})
