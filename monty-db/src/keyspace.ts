import { HEADERS } from './headers'

// @typescript-eslint/explicit-module-boundary-types
export async function putKeys(request: Request, json: any): Promise<Response> {
  const keys = json.config // mapping of key to value

  if (typeof keys === undefined) {
    return new Response(JSON.stringify({ error: 'No keys provided' }), {
      status: 400,
      headers: HEADERS,
    })
  }

  // TODO: more validation!

  for (const property in keys) {
    // console.log(`${property}: ${keys[property]}`);
    await MONTY_DB.put(property, keys[property])
  }
  // console.log(typeof keys)
  return new Response(null, { status: 204, headers: HEADERS })
}

export async function getKeys(request: Request, json: any): Promise<Response> {
  const toGet: Array<string> = json.config // array

  // TODO: validation!

  const keyResult = new Map()
  for (const i in toGet) {
    const value = await MONTY_DB.get(toGet[i])
    // console.log(value)
    keyResult.set(toGet[i], value)
  }
  return new Response(
    JSON.stringify({ config: Object.fromEntries(keyResult) }),
    { status: 200, headers: HEADERS },
  )
}

export async function deleteKeys(
  request: Request,
  json: any,
): Promise<Response> {
  return new Response(null, { status: 501, headers: HEADERS })
  // return new Response(null, { status: 204, headers: HEADERS })
}
