const fetchRouteDB = async (routeId: string) => {
  const headers = new Headers() as any

  const baseUrl = process.env.REACT_APP_URL

  // headers.set('Authorization', authorization)
  headers.set('Content-Type', 'application/json')

  const url = `${baseUrl}/search?id=${routeId}`

  const response = await fetch(url, {
    headers,
    method: 'GET'
  })

  return await response.json()
}

export default fetchRouteDB
