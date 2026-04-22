import axios from 'axios'
import { usePlayerStore } from '@/stores/player'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const http = axios.create({ baseURL: BASE_URL })

// Inject debug auth headers on every request
http.interceptors.request.use(config => {
  const player = usePlayerStore()
  config.headers['X-Debug-Actor-Type'] = player.actorType || 'user'
  config.headers['X-Debug-Actor-Id'] = player.playerId || 'anonymous'
  return config
})

// ─── Question Lists ───────────────────────────────────────────────────────────

export function getPublicLists() {
  return http.get('/question-lists/public').then(r => r.data)
}

export function getPrivateLists() {
  return http.get('/question-lists/private').then(r => r.data)
}

export function getList(id) {
  return http.get(`/question-lists/${id}`).then(r => r.data)
}

export function createList(payload) {
  // payload: { name, visibility } — visibility: 'public' | 'private'
  return http.post('/question-lists', payload).then(r => r.data)
}

export function getListQuestions(id) {
  return http.get(`/question-lists/${id}/questions`).then(r => r.data)
}

export function addQuestion(listId, payload) {
  // payload: { text, options: [{ text, correct }] }
  return http.post(`/question-lists/${listId}/questions`, payload).then(r => r.data)
}

// ─── Games ────────────────────────────────────────────────────────────────────

export function createGame(questionListId) {
  return http.post('/games', { question_list_id: questionListId }).then(r => r.data)
}

export function joinGame(gameId) {
  return http.post(`/games/${gameId}/join`).then(r => r.data)
}

export function getGame(gameId) {
  return http.get(`/games/${gameId}`).then(r => r.data)
}

export function startGame(gameId) {
  return http.post(`/games/${gameId}/start`).then(r => r.data)
}

export function closeQuestion(gameId) {
  return http.post(`/games/${gameId}/close`).then(r => r.data)
}

// ─── Health ───────────────────────────────────────────────────────────────────

export function checkHealth() {
  return http.get('/health').then(r => r.data)
}
