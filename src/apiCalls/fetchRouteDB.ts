import { Body } from '../types'

const fetchRouteDB = async (routeId: string) => {
  const headers = new Headers() as any

  const baseUrl = process.env.REACT_APP_URL

  // headers.set('Authorization', authorization)
  headers.set('Content-Type', 'application/json')

  const url = `${baseUrl}/searchJson?id=${routeId}`

  const response = await fetch(url, {
    method: 'GET',
    headers,
  })

  return await response.json()
}

export default fetchRouteDB