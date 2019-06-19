import { Body } from '../types'

const routingApi = async (profile: string, authorization: string, body: Body) => {

  const headers = new Headers() as any

  // authorization required if not on production env
  process.env.NODE_ENV !== 'production' && headers.set('Authorization', authorization);
  headers.set('Content-Type', 'application/json');

  const baseUrl = process.env.REACT_APP_ROUTE_URL || ''

  const url = baseUrl.replace(':profile', profile)

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  return await response.json()
}

export default routingApi