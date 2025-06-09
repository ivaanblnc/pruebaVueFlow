// Endpoint para subir archivo a Google Drive
import { uploadFileToDrive, getOAuth2Client } from '~/utils/googleDriveApi'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, mimeType, buffer, tokens } = body
  const oauth2Client = getOAuth2Client(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  )
  oauth2Client.setCredentials(tokens)
  const res = await uploadFileToDrive(oauth2Client, { name, mimeType, buffer: Buffer.from(buffer.data) })
  return res
})
