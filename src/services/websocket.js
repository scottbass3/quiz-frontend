const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'

/**
 * QuizWebSocket wraps a native WebSocket and exposes a simple
 * event-listener API that mirrors the backend's event names.
 *
 * Usage:
 *   const ws = new QuizWebSocket(gameId, playerId)
 *   ws.on('question_started', handler)
 *   ws.connect()
 *   ws.send('submit_answer', { question_id, option_id })
 *   ws.disconnect()
 */
export class QuizWebSocket {
  constructor(gameId, playerId) {
    this.gameId = gameId
    this.playerId = playerId
    this._socket = null
    this._listeners = {}
    this._reconnectAttempts = 0
    this._maxReconnects = 5
    this._closed = false
  }

  /** Register a handler for a server event type */
  on(event, handler) {
    if (!this._listeners[event]) {
      this._listeners[event] = []
    }
    this._listeners[event].push(handler)
    return this
  }

  /** Remove a handler */
  off(event, handler) {
    if (!this._listeners[event]) return
    this._listeners[event] = this._listeners[event].filter(h => h !== handler)
  }

  /** Connect to the game WebSocket */
  connect() {
    if (this._socket) return
    this._closed = false
    const url = `${WS_BASE_URL}/ws?gameId=${this.gameId}&playerId=${this.playerId}`
    this._socket = new WebSocket(url)

    this._socket.onopen = () => {
      this._reconnectAttempts = 0
      this._emit('connected', {})
    }

    this._socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type) {
          this._emit(msg.type, msg.data ?? msg)
        }
      } catch {
        // ignore malformed messages
      }
    }

    this._socket.onerror = () => {
      this._emit('error', {})
    }

    this._socket.onclose = () => {
      this._socket = null
      this._emit('disconnected', {})
      if (!this._closed && this._reconnectAttempts < this._maxReconnects) {
        const delay = Math.min(1000 * 2 ** this._reconnectAttempts, 15000)
        this._reconnectAttempts++
        setTimeout(() => this.connect(), delay)
      }
    }
  }

  /** Send an event to the server */
  send(type, data) {
    if (this._socket?.readyState === WebSocket.OPEN) {
      this._socket.send(JSON.stringify({ type, data }))
    }
  }

  /** Submit an answer */
  submitAnswer(questionId, optionId) {
    this.send('submit_answer', { question_id: questionId, option_id: optionId })
  }

  /** Close the connection permanently (no reconnect) */
  disconnect() {
    this._closed = true
    this._socket?.close()
    this._socket = null
  }

  _emit(event, data) {
    const handlers = this._listeners[event] || []
    handlers.forEach(h => h(data))
  }
}
