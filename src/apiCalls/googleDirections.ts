import polyline from '@mapbox/polyline'
import { Route } from '../types'

const travelModes = {
  car: 'DRIVING',
  foot: 'WALKING'
} as any

const googleDirections = (google: any, profile: any, locations: any): Promise<Route> => {

  return new Promise((resolve) => {

    const origin = new google.maps.LatLng(locations[0].lat, locations[0].lng)
    const destination = new google.maps.LatLng(locations.slice(-1)[0].lat, locations.slice(-1)[0].lng)

    new google.maps.DirectionsService().route({
        origin,
        destination,
        travelMode: travelModes[profile],
        drivingOptions: {
          departureTime: new Date(),
        }
      }, (response: any, status: any) => {
      if (status === 'OK') {
        const duration = response.routes[0].legs[0].duration.value
        const distance = response.routes[0].legs[0].distance.value
        const tripPolyline = response.routes[0].overview_polyline
        const routePath = polyline.decode(tripPolyline).map(coord => ({ lat: coord[0], lon: coord[1] }))

        resolve({
          id: 'google-maps',
          duration,
          distance,
          routePath,
        })
      }
    })
  })
}

export default googleDirections