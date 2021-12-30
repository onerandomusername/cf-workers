import { HEADERS } from './headers'

export async function checkAuth(request: Request): Promise<Response | boolean> {
  if (!request.headers.has('Authorization')) {
    return new Response(
      JSON.stringify({ error: 'Authorization is required' }),
      { status: 401, headers: HEADERS },
    )
  }
  const token = MONTY_DB_TOKEN

  if (request.headers.get('Authorization') == 'Bearer ' + token) {
    return true
  } else {
    return new Response(
      JSON.stringify({ error: 'You are not permitted to make this action.' }),
      { status: 403, headers: HEADERS },
    )
  }
}
