<template>
  <div class="connect-google-node">
    <button :disabled="!googleAuthUrl" @click="connectToGoogle" class="google-btn">
      {{ googleAuthUrl ? 'Conectar Google Drive' : 'Cargando...' }}
    </button>
    <div v-if="!googleAuthUrl" style="color:red; font-size:13px;">No se pudo cargar la URL de autenticación.</div>
    <div v-if="googleAuthUrl" style="font-size:11px; color:#888; word-break:break-all; margin-top:6px;">
      <b>Debug URL:</b> {{ googleAuthUrl }}
    </div>
    <div v-if="isGoogleAuthed" style="color:green; font-weight:bold; margin-top:10px;">Google Drive conectado</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const googleAuthUrl = ref('')
const isGoogleAuthed = ref(false)

async function fetchGoogleAuthUrl() {
  try {
    const res = await fetch('/api/google-drive-auth')
    const data = await res.json()
    if (data.url) {
      googleAuthUrl.value = data.url
    }
  } catch {}
}

function connectToGoogle() {
  if (googleAuthUrl.value) {
    window.location.href = googleAuthUrl.value
  }
}

onMounted(async () => {
  fetchGoogleAuthUrl()
  // Detectar si ya está autenticado
  const tokens = localStorage.getItem('googleDriveTokens')
  isGoogleAuthed.value = !!tokens

  // Gestionar callback OAuth2 SOLO desde el nodo
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  if (code) {
    // Borra el code de la URL antes de cualquier otra acción para evitar dobles envíos
    url.searchParams.delete('code')
    window.history.replaceState({}, document.title, url.pathname)
    try {
      const res = await fetch('/api/google-drive-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const tokens = await res.json()
      if (tokens.error || tokens.error_description) {
        alert('Error autenticando con Google Drive: ' + (tokens.error_description || tokens.error))
        isGoogleAuthed.value = false
        localStorage.removeItem('googleDriveTokens')
      } else if (tokens.access_token) {
        localStorage.setItem('googleDriveTokens', JSON.stringify(tokens))
        isGoogleAuthed.value = true
      } else {
        alert('Error inesperado autenticando con Google Drive. Intenta de nuevo.')
        isGoogleAuthed.value = false
        localStorage.removeItem('googleDriveTokens')
      }
    } catch (err) {
      alert('Error de red autenticando con Google Drive: ' + err)
      isGoogleAuthed.value = false
      localStorage.removeItem('googleDriveTokens')
    }
  }
})
</script>

<style scoped>
.connect-google-node {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.google-btn {
  background: #4285f4;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 8px;
}
.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
