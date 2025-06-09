// Endpoint para obtener la URL de autenticación de Google Drive
import { getOAuth2Client, generateAuthUrl } from '~/utils/googleDriveApi'

export default defineEventHandler(async (event) => {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!
  console.log('[GoogleDriveAuth] clientId:', clientId)
  console.log('[GoogleDriveAuth] clientSecret:', clientSecret ? '***' : 'undefined')
  console.log('[GoogleDriveAuth] redirectUri:', redirectUri)
  const oauth2Client = getOAuth2Client(clientId, clientSecret, redirectUri)
  const url = generateAuthUrl(oauth2Client)
  console.log('[GoogleDriveAuth] URL generada:', url)
  return { url }
})
