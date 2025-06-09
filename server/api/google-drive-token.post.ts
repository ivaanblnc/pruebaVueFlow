// Endpoint para intercambiar el code de Google por tokens
import { getOAuth2Client, getTokens } from '~/utils/googleDriveApi'

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event)
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!
  console.log('[GoogleDriveToken] code recibido:', code)
  console.log('[GoogleDriveToken] redirectUri usado:', redirectUri)
  const oauth2Client = getOAuth2Client(clientId, clientSecret, redirectUri)
  const tokens = await getTokens(oauth2Client, code)
  return tokens
})
