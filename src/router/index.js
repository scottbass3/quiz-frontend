import { createRouter, createWebHistory } from 'vue-router'
import { usePlayerStore } from '@/stores/player'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/lobby',
    name: 'lobby',
    component: () => import('@/views/LobbyView.vue'),
    meta: { requiresPlayer: true }
  },
  {
    path: '/games/:id/waiting',
    name: 'waiting',
    component: () => import('@/views/WaitingRoomView.vue'),
    meta: { requiresPlayer: true }
  },
  {
    path: '/games/:id/play',
    name: 'game',
    component: () => import('@/views/GameView.vue'),
    meta: { requiresPlayer: true }
  },
  {
    path: '/games/:id/over',
    name: 'game-over',
    component: () => import('@/views/GameOverView.vue'),
    meta: { requiresPlayer: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.requiresPlayer) {
    const player = usePlayerStore()
    if (!player.playerId) {
      return { name: 'home' }
    }
  }
})

export default router
