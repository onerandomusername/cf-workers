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

export async function getKeys(request: Request): Promise<Response> {
  /*
  Get keys

  Due to web-standards, we use query params instead of the body.
  */
  // const toGet: Array<string> = json.config // array

  const url = new URL(request.url)
  const json = url.searchParams.get('json') || '{}'
  // console.log(json)

  let toGet = null
  let invalidOrMissingJson = false
  try {
    toGet = JSON.parse(json)
    // console.log(toGet)
  } catch (e) {
    invalidOrMissingJson = true
  }

  if (invalidOrMissingJson || !toGet || toGet.config === undefined) {
    return new Response(
      JSON.stringify({ error: 'No keys provided or invalid json.' }),
      {
        status: 400,
        headers: HEADERS,
      },
    )
  }

  const keyResult = new Map()
  const promises = toGet.config.map((key: string) =>
    MONTY_DB.get(key).then((value) => {
      if (value !== null) keyResult.set(key, value)
    }),
  )
  await Promise.all(promises)

  return new Response(
    JSON.stringify({ config: Object.fromEntries(keyResult) }),
    { status: 200, headers: HEADERS },
  )
}

export async function listKeys(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const query = url.searchParams.get('query') || null
  if (!query) {
    return new Response(JSON.stringify({ error: 'No query provided' }), {
      status: 400,
      headers: HEADERS,
    })
  }

  const keys = await MONTY_DB.list({ prefix: query })
  // console.log(keys)
  return new Response(JSON.stringify({ result: keys }), {
    status: 200,
    headers: HEADERS,
  })
}

export async function deleteKeys(
  request: Request,
  json: any,
): Promise<Response> {
  const keys: string[] = json.config // mapping of key to value
  if (typeof keys === undefined) {
    return new Response(JSON.stringify({ error: 'No keys provided' }), {
      status: 400,
      headers: HEADERS,
    })
  }

  // console.log(keys)
  for (const k in keys) {
    // console.log(keys[k])
    await MONTY_DB.delete(keys[k])
  }
  return new Response(null, { status: 204, headers: HEADERS })
}
