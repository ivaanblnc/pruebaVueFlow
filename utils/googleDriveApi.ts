// utils/googleDriveApi.ts
// Lógica para autenticación y subida a Google Drive usando OAuth 2.0 (Node.js backend)
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/drive.file']

export function getOAuth2Client(clientId: string, clientSecret: string, redirectUri: string) {
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

export function generateAuthUrl(oauth2Client: any) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
}

export async function getTokens(oauth2Client: any, code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  return tokens
}

export async function uploadFileToDrive(auth: any, file: { name: string, mimeType: string, buffer: Buffer }) {
  const drive = google.drive({ version: 'v3', auth })
  const res = await drive.files.create({
    requestBody: {
      name: file.name,
      mimeType: file.mimeType,
    },
    media: {
      mimeType: file.mimeType,
      body: file.buffer,
    },
    fields: 'id, name, webViewLink',
  })
  return res.data
}
