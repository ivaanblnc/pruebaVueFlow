import { getQuery, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log('[GoogleDriveCallback] Query params recibidos:', query)
  const code = query.code
  if (!code) {
    console.error('[GoogleDriveCallback] No se recibió parámetro code en la query:', query)
    // Puedes redirigir a un error o dejarlo sin code
    return sendRedirect(event, '/?error=missing_code')
  }
  return sendRedirect(event, '/?code=' + code)
})
