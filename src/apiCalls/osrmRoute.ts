import { Location } from '../types'

const osrmRoutingApi = async (
  locations: Location[],
  profile: string,
  endpoint: string = process.env.REACT_APP_ROUTING_URL || ''
) => {
  const headers = new Headers() as any

  headers.set('Content-Type', 'application/json')
  headers.set('sec-fetch-mode', 'cors')
  headers.set('origin', 'https://map.project-osrm.org')

  const coords = locations
    .reduce((accum: string[], loc) => {
      return loc.lat && loc.lon ? [...accum, `${loc.lon},${loc.lat}`] : accum
    }, [])
    .join(';')

  const url = `${endpoint}/route/v1/${profile}/${coords}?overview=false&alternatives=true&steps=true`

  const response = await fetch(url, {
    headers,
    method: 'GET'
  })

  return await response.json()
}

export default osrmRoutingApi
