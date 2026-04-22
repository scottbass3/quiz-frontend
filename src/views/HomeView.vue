<template>
  <div class="phone">
    <div class="screen" style="padding:44px 24px 32px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;min-height:100dvh;position:relative;overflow:hidden;">

      <!-- Background blobs -->
      <div style="position:absolute;top:-70px;right:-70px;width:220px;height:220px;background:#fde8c8;border-radius:50%;border:3px solid #f9c896;z-index:0;"/>
      <div style="position:absolute;top:100px;left:-50px;width:130px;height:130px;background:#fce7f3;border-radius:50%;border:3px solid #fbcfe8;z-index:0;"/>
      <div style="position:absolute;bottom:60px;right:-30px;width:100px;height:100px;background:#d1fae5;border-radius:50%;border:3px solid #a7f3d0;z-index:0;"/>

      <!-- Main content -->
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:36px;z-index:1;width:100%;">

        <!-- Icon + Logo -->
        <div style="text-align:center;">
          <div style="width:104px;height:104px;background:#f97316;border-radius:50%;border:3px solid #1c1917;box-shadow:5px 5px 0 #1c1917;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;animation:bounceIn .6s ease;">
            <span style="font-size:56px;line-height:1;">❓</span>
          </div>
          <LogoDisplay size="xl" />
          <p style="font-family:'Fredoka One',cursive;font-size:14px;color:#57534e;margin-top:6px;letter-spacing:2px;opacity:.8;">LE QUIZ MULTIJOUEUR</p>
        </div>

        <!-- Form -->
        <div style="width:100%;max-width:330px;display:flex;flex-direction:column;gap:14px;">
          <div>
            <label style="font-family:'Fredoka One',cursive;font-size:16px;color:#1c1917;display:block;margin-bottom:6px;">Ton pseudo</label>
            <input
              v-model="name"
              class="inp"
              type="text"
              placeholder="SuperQuizzer"
              maxlength="32"
              autocomplete="off"
              @keydown.enter="handleEnter"
            />
          </div>

          <div>
            <label style="font-family:'Fredoka One',cursive;font-size:16px;color:#1c1917;display:block;margin-bottom:6px;">Rôle</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <button
                class="btn"
                :class="role === 'user' ? 'btn-orange' : 'btn-white'"
                style="font-size:16px;padding:12px 16px;"
                @click="role = 'user'"
              >🎮 Joueur</button>
              <button
                class="btn"
                :class="role === 'admin' ? 'btn-orange' : 'btn-white'"
                style="font-size:16px;padding:12px 16px;"
                @click="role = 'admin'"
              >⚙️ Admin</button>
            </div>
          </div>

          <button
            class="btn btn-orange"
            style="font-size:22px;padding:18px 24px;margin-top:4px;"
            :disabled="!name.trim()"
            @click="handleEnter"
          >
            🎮 Jouer maintenant
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div style="display:flex;gap:20px;z-index:1;">
        <span v-for="l in ['CGU','Confidentialité','Contact']" :key="l"
          style="font-family:'Nunito',sans-serif;font-weight:600;font-size:12px;color:#57534e;opacity:.55;">
          {{ l }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import LogoDisplay from '@/components/LogoDisplay.vue'

const router      = useRouter()
const playerStore = usePlayerStore()

const name = ref(playerStore.playerName || '')
const role = ref(playerStore.actorType || 'user')

function handleEnter() {
  if (!name.value.trim()) return
  playerStore.setIdentity(name.value.trim(), role.value)
  router.push('/lobby')
}
</script>
