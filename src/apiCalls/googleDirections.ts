import polyline from '@mapbox/polyline'
import { Route, GoogleResponse } from '../types'

const travelModes = {
  car: 'DRIVING',
  foot: 'WALKING'
} as any

const googleDirections = (google: any, profile: any, locations: any): Promise<GoogleResponse> => {

  return new Promise((resolve, reject) => {

    const origin = new google.maps.LatLng(locations[0].lat, locations[0].lng)
    const destination = new google.maps.LatLng(locations.slice(-1)[0].lat, locations.slice(-1)[0].lng)

    new google.maps.DirectionsService().route({
        origin,
        destination,
        travelMode: travelModes[profile],
        drivingOptions: {
          departureTime: new Date(),
        }
      }, (response: GoogleResponse, status: any) => {
      resolve(response)
    })
  })
}

export default googleDirections