import polyline from '@mapbox/polyline'
import nanoid from 'nanoid'
import {
  Coords2,
  GoogleResponse,
  MatchLeg,
  MatchResponse,
  Route,
  RouteLeg,
  RouteResponse,
  RouteSchema
} from '../types'
import { transformToObject } from '../utils/functions'

export const routeConverter = (routes: RouteSchema[]): Route[] => {
  return routes.map((route: RouteSchema) => {
    const routePath = [...transformToObject(route.geometry.coordinates)]

    return {
      id: route.id,
      distance: route.distance,
      duration: route.eta,
      routePath,
      parsedValue: route
    }
  })
}

export const routeConverterFromRouteService = (
  response: RouteResponse,
  id = nanoid()
) => {
  return {
    id,
    duration: response.routes[0].totalDuration,
    distance: response.routes[0].totalDistance,
    routePath: response.routes[0].legs.reduce((accum: Coords2[], leg: RouteLeg) => {
      return [...accum, ...(leg.geometry ? leg.geometry : [])]
    }, []),
    type: 'Route',
    parsedValue: response
  }
}

export const routeConverterFromMatchService = (
  response: MatchResponse,
  id = nanoid()
) => {
  return {
    id,
    ...response.matchings[0].legs.reduce(
      (
        accum: { duration: number; distance: number; routePath: Coords2[] },
        leg: MatchLeg
      ) => {
        return {
          duration: accum.duration + leg.duration,
          distance: accum.distance + leg.distance,
          routePath: [...accum.routePath, ...(leg.geometry ? leg.geometry : [])]
        }
      },
      {
        duration: 0,
        distance: 0,
        routePath: []
      }
    ),
    type: 'Match',
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
    routePath: polyline
      .decode(tripPolyline)
      .map(coord => ({ lat: coord[0], lon: coord[1] })),
    parsedValue: response
  }
}
