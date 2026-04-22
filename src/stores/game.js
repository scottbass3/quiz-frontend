import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // Game metadata
  const gameId = ref(null)
  const questionCount = ref(0)
  const currentQuestionIndex = ref(0)

  // Game phase: 'waiting' | 'question_active' | 'question_closed' | 'game_over'
  const phase = ref('waiting')

  // Players in the game
  const players = ref([])

  // Current question data
  const currentQuestion = ref(null)

  // Answer state
  const selectedOptionId = ref(null)
  const answerSubmitted = ref(false)
  const submittedAnswers = ref([]) // [{player_id, option_id}]

  // After question close
  const correctOptionId = ref(null)
  const questionResults = ref([]) // [{player_id, correct, lives_remaining}]

  // Elimination tracking
  const eliminatedPlayerIds = ref(new Set())

  // Game over
  const winnerId = ref(null)

  // Derived
  const activePlayers = computed(() =>
    players.value.filter(p => !eliminatedPlayerIds.value.has(p.id))
  )

  const activePlayerCount = computed(() => activePlayers.value.length)

  const isGameOver = computed(() => phase.value === 'game_over')

  function setGame(id) {
    gameId.value = id
    phase.value = 'waiting'
    players.value = []
    currentQuestion.value = null
    selectedOptionId.value = null
    answerSubmitted.value = false
    correctOptionId.value = null
    questionResults.value = []
    eliminatedPlayerIds.value = new Set()
    winnerId.value = null
    currentQuestionIndex.value = 0
  }

  function setPlayers(playerList) {
    players.value = playerList
  }

  function addPlayer(player) {
    const exists = players.value.find(p => p.id === player.id)
    if (!exists) {
      players.value.push(player)
    }
  }

  // WebSocket event handlers
  function onGameJoined(data) {
    questionCount.value = data.question_count ?? data.questionCount ?? 0
  }

  function onQuestionStarted(data) {
    phase.value = 'question_active'
    currentQuestion.value = {
      id: data.question_id ?? data.id,
      text: data.text ?? data.question,
      options: data.options ?? []
    }
    currentQuestionIndex.value = data.index ?? currentQuestionIndex.value + 1
    selectedOptionId.value = null
    answerSubmitted.value = false
    submittedAnswers.value = []
    correctOptionId.value = null
    questionResults.value = []
  }

  function onAnswerSubmitted(data) {
    submittedAnswers.value.push({
      playerId: data.player_id ?? data.playerId,
      optionId: data.option_id ?? data.optionId
    })
  }

  function onQuestionClosed(data) {
    phase.value = 'question_closed'
    correctOptionId.value = data.correct_option_id ?? data.correctOptionId
    questionResults.value = data.results ?? []

    // Update player lives from results
    if (data.results) {
      data.results.forEach(result => {
        const player = players.value.find(
          p => p.id === (result.player_id ?? result.playerId)
        )
        if (player) {
          player.lives = result.lives_remaining ?? result.livesRemaining
        }
      })
    }
  }

  function onPlayerEliminated(data) {
    const id = data.player_id ?? data.playerId
    eliminatedPlayerIds.value = new Set([...eliminatedPlayerIds.value, id])
    const player = players.value.find(p => p.id === id)
    if (player) {
      player.eliminated = true
      player.lives = 0
    }
  }

  function onGameOver(data) {
    phase.value = 'game_over'
    winnerId.value = data.winner_id ?? data.winnerId
  }

  function selectOption(optionId) {
    if (!answerSubmitted.value) {
      selectedOptionId.value = optionId
    }
  }

  function markAnswerSubmitted() {
    answerSubmitted.value = true
  }

  function reset() {
    gameId.value = null
    phase.value = 'waiting'
    players.value = []
    currentQuestion.value = null
    selectedOptionId.value = null
    answerSubmitted.value = false
    submittedAnswers.value = []
    correctOptionId.value = null
    questionResults.value = []
    eliminatedPlayerIds.value = new Set()
    winnerId.value = null
    questionCount.value = 0
    currentQuestionIndex.value = 0
  }

  return {
    gameId,
    questionCount,
    currentQuestionIndex,
    phase,
    players,
    currentQuestion,
    selectedOptionId,
    answerSubmitted,
    submittedAnswers,
    correctOptionId,
    questionResults,
    eliminatedPlayerIds,
    winnerId,
    activePlayers,
    activePlayerCount,
    isGameOver,
    setGame,
    setPlayers,
    addPlayer,
    onGameJoined,
    onQuestionStarted,
    onAnswerSubmitted,
    onQuestionClosed,
    onPlayerEliminated,
    onGameOver,
    selectOption,
    markAnswerSubmitted,
    reset
  }
})
