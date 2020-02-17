import { OSRMQueryParams } from '../types'

const osrmRoutingApi = async (
  coordsString: string,
  profile: string,
  endpoint: string = process.env.REACT_APP_ROUTING_URL || '',
  overrideQueryParams: OSRMQueryParams
) => {
  const headers = new Headers() as any

  headers.set('Content-Type', 'application/json')
  headers.set('sec-fetch-mode', 'cors')
  headers.set('origin', 'https://map.project-osrm.org')

  const queryParams = {
    alternatives: false,
    overview: false,
    steps: true,
    ...overrideQueryParams
  }

  const queryParamsString = Object.entries(queryParams)
    .map(([param, value]) => `${param}=${value}`)
    .join('&')

  const url = `${endpoint}/route/v1/${profile}/${coordsString}?${queryParamsString}`

  const response = await fetch(url, {
    headers,
    method: 'GET'
  })

  return await response.json()
}

export default osrmRoutingApi
