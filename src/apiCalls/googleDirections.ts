import { GoogleResponse } from '../types'

const travelModes = {
  car: 'DRIVING',
  foot: 'WALKING'
} as any

const googleDirections = (
  google: any,
  profile: any,
  locations: any
): Promise<GoogleResponse> => {
  return new Promise(resolve => {
    const origin = new google.maps.LatLng(locations[0].lat, locations[0].lng)
    const destination = new google.maps.LatLng(
      locations.slice(-1)[0].lat,
      locations.slice(-1)[0].lng
    )

    new google.maps.DirectionsService().route(
      {
        destination,
        drivingOptions: {
          departureTime: new Date()
        },
        origin,
        travelMode: travelModes[profile]
      },
      (response: GoogleResponse, status: any) => {
        resolve(response)
      }
    )
  })
}

export default googleDirections
