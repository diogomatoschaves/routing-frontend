import { RouteSchema, Route, RouteResponse, GoogleResponse, Coords2 } from '../types' 
import { transformToObject } from '../utils/functions'
import nanoid from 'nanoid'
import polyline from '@mapbox/polyline';


export const routeConverter = (routes: Array<RouteSchema>): Array<Route> => {
  return routes.map((route: RouteSchema) => {
    
    const routePath = [
      ...transformToObject(route.geometry.coordinates), 
    ]

    return {
      id: route.id,
      distance: route.distance,
      duration: route.eta,
      routePath,
      parsedValue: route
    }
  })
}

export const routeConverterFromRoutingService = (response: RouteResponse, id = nanoid()) => {
  return { 
    id,
    duration: response.routes[0].totalDuration,
    distance: response.routes[0].totalDistance,
    routePath: response.routes[0].legs.reduce((accum: Array<Coords2>, leg) => {
      return [...accum, ...leg.geometry]
    }, []),
    parsedValue: response
  }
}

export const routeConverterFromGoogle = (response: GoogleResponse) => {
  const tripPolyline = response.routes[0].overview_polyline
  return { 
    id: 'routeGOOGLE',
    duration: response.routes[0].legs.reduce((accum: number, leg: any) => {
      return accum + leg.duration.value
    }, 0),
    distance: response.routes[0].legs.reduce((accum: number, leg: any) => {
      return accum + leg.distance.value
    }, 0),
    routePath: polyline.decode(tripPolyline).map(coord => ({ lat: coord[0], lon: coord[1] })),
    parsedValue: response
  }
}