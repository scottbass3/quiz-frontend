<template>
  <header style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:2.5px solid #1c1917;background:var(--cream);position:sticky;top:0;z-index:50;">
    <RouterLink to="/lobby" style="display:flex;align-items:center;gap:8px;text-decoration:none;">
      <LogoDisplay size="sm" />
    </RouterLink>

    <div style="display:flex;align-items:center;gap:10px;">
      <span class="badge" :style="{ background: playerStore.isAdmin ? '#fde8c8' : '#dcfce7' }">
        {{ playerStore.isAdmin ? '⚙️ Admin' : '🎮 ' + playerStore.playerName }}
      </span>
      <button class="back-btn" style="font-size:20px;color:#1c1917;" @click="handleLeave" title="Quitter">✕</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import LogoDisplay from './LogoDisplay.vue'

const router      = useRouter()
const playerStore = usePlayerStore()
const gameStore   = useGameStore()

function handleLeave() {
  gameStore.reset()
  router.push('/lobby')
}
</script>
