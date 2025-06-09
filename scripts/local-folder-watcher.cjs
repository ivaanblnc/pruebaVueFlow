// scripts/local-folder-watcher.js
// Script Node.js para monitorizar una carpeta local y subir archivos a Google Drive vía backend Nuxt

const chokidar = require('chokidar')
const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

// CONFIGURACIÓN: Cambia estos valores según tu entorno
const WATCH_FOLDER = 'C:/ruta/a/tu/carpeta' // <-- Cambia por la carpeta a monitorizar
const NUXT_UPLOAD_URL = 'http://localhost:3000/api/google-drive-upload' // Tu endpoint backend
const GOOGLE_TOKENS_PATH = path.join(__dirname, 'google_tokens.json') // Donde guardarás el token

// Lee el token de Google Drive desde archivo
function getGoogleTokens() {
  if (!fs.existsSync(GOOGLE_TOKENS_PATH)) {
    console.error('[Watcher] No se encontró google_tokens.json con el access_token. Exporta el token desde el navegador.')
    return null
  }
  return JSON.parse(fs.readFileSync(GOOGLE_TOKENS_PATH, 'utf-8'))
}

function saveGoogleTokens(tokens) {
  fs.writeFileSync(GOOGLE_TOKENS_PATH, JSON.stringify(tokens, null, 2))
  console.log('[Watcher] Token Google guardado en', GOOGLE_TOKENS_PATH)
}

// Monitoriza la carpeta
chokidar.watch(WATCH_FOLDER, { persistent: true })
  .on('add', filePath => uploadFile(filePath))
  .on('change', filePath => uploadFile(filePath))

async function uploadFile(filePath) {
  const tokens = getGoogleTokens()
  if (!tokens) return
  const fileStream = fs.createReadStream(filePath)
  const form = new FormData()
  form.append('name', path.basename(filePath))
  form.append('mimeType', 'application/octet-stream') // Puedes mejorar esto detectando el mime real
  form.append('file', fileStream)
  form.append('tokens', JSON.stringify(tokens))

  try {
    const res = await fetch(NUXT_UPLOAD_URL, {
      method: 'POST',
      body: form
    })
    const result = await res.json()
    console.log('[Watcher] Subido a Google Drive:', result)
  } catch (err) {
    console.error('[Watcher] Error subiendo archivo:', err)
  }
}

// Utilidad para exportar el token desde el navegador
// Ejecuta esto en consola del navegador tras conectar Google Drive:
//   copy(localStorage.getItem('googleDriveTokens'))
// Pega el resultado en google_tokens.json en la carpeta scripts/
