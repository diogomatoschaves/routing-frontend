import { Body } from '../types'

const routingApi = async (
  profile: string,
  authorization: string,
  body: Body,
  endpoint: string
) => {
  const headers = new Headers() as any

  headers.set('Authorization', authorization)
  headers.set('Content-Type', 'application/json')

  endpoint = endpoint.replace('${PROFILE}', profile)
  const url = `${endpoint}/v1/route`

  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers,
    method: 'POST'
  })

  return await response.json()
}

export default routingApi
