import { HEADERS } from './headers'
import { checkAuth } from './tokens'
import { putKeys, getKeys, deleteKeys } from './keyspace'

export async function handleRequest(request: Request): Promise<Response> {
  if (['POST', 'GET', 'DELETE', 'PUT'].indexOf(request.method) === -1) {
    return new Response(null, { status: 405 })
  }
  // check the auth token
  const is_valid = await checkAuth(request)
  if (is_valid instanceof Response) {
    return is_valid
  } else if (!is_valid) {
    return new Response(
      JSON.stringify({ error: 'You are not permitted to make this action.' }),
      { status: 401, headers: HEADERS },
    )
  }

  // Check the body is valid json and parse it
  if (request.method === 'GET') {
    return await getKeys(request)
  }

  let json: any
  try {
    // we're using this instead of Request.json() because that logs an error internally on fail
    const text = await request.text()
    console.log(text)
    json = JSON.parse(text)
  } catch (e) {
    if (e instanceof SyntaxError) {
      return new Response(JSON.stringify({ error: e.toString() }), {
        status: 400,
        headers: HEADERS,
      })
    } else {
      throw e
    }
  }

  // console.log(JSON.stringify(json, null, 4))
  // console.log(JSON.stringify(json.config, null, 4))

  // actually execute the request
  if (request.method === 'POST' || request.method === 'PUT') {
    return putKeys(request, json)
  } else if (request.method === 'DELETE') {
    return deleteKeys(request, json)
  } else {
    throw new Error('unreachable')
  }
}
