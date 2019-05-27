import { Location, Coords2 } from '../types'

const routingApi = async (profile: string, authorization: string, locations: Array<Location>) => {

  const headers = new Headers() as any
  headers.set('Authorization', authorization);
  headers.set('Content-Type', 'application/json');

  const baseUrl = process.env.REACT_APP_ROUTE_URL || ''

  const url = `${baseUrl}/${profile}/v1/route`

  const body =  JSON.stringify({ 
    locations: locations.reduce((accum: Array<Coords2>, location: Location) => {
      return [
        ...accum, {
          lat: location.lat ? location.lat : 0, 
          lon: location.lng ? location.lng : 0
        }
      ]
    }, []), 
    reportGeometry: true,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  })

  return await response.json()
  
  // if(response.status !== 200) {
  //   console.log(`Error fetching route, received ${response.status}`)
  // } else {
    
  // }
}

export default routingApi