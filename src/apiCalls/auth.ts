const auth = async (endpoint: string) => {
  const headers = new Headers() as any

  headers.set('Content-Type', 'application/json')

  const url = `${endpoint}/auth`

  const response = await fetch(url, {
    headers,
    method: 'GET'
  })

  return await response.json()
}

export default auth
