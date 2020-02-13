import polyline from '@mapbox/polyline'
import nanoid from 'nanoid'
import {
  Coords2,
  GoogleResponse,
  MatchLeg,
  MatchResponse,
  OSRMRoute,
  OSRMRouteLeg,
  OSRMRouteResponse,
  Route,
  RouteLeg,
  RouteResponse,
  RouteSchema
} from '../types'
import { transformToObject } from './functions'

export const routeConverter = (routes: RouteSchema[]): Route[] => {
  return routes.map((route: RouteSchema) => {
    const routePath = [transformToObject(route.geometry.coordinates)]

    return {
      distance: route.distance,
      duration: route.eta,
      id: route.id,
      parsedValue: route,
      routePath
    }
  })
}

export const routeConverterFromRouteService = (
  response: RouteResponse,
  id = nanoid()
) => {
  return {
    distance: response.routes[0].totalDistance,
    duration: response.routes[0].totalDuration,
    id,
    parsedValue: response,
    routePath: response.routes[0].legs.reduce((accum: Coords2[][], leg: RouteLeg) => {
      return [...accum, leg.geometry ? leg.geometry : []]
    }, []),
    type: 'Route'
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
        accum: { duration: number; distance: number; routePath: Coords2[][] },
        leg: MatchLeg
      ) => {
        return {
          distance: accum.distance + leg.distance,
          duration: accum.duration + leg.duration,
          routePath: [...accum.routePath, leg.geometry ? leg.geometry : []]
        }
      },
      {
        distance: 0,
        duration: 0,
        routePath: []
      }
    ),
    parsedValue: response,
    type: 'Match'
  }
}

export const routeConverterFromGoogle = (response: GoogleResponse) => {
  const tripPolyline = response.routes[0].overview_polyline
  return {
    distance: response.routes[0].legs.reduce((accum: number, leg: any) => {
      return accum + leg.distance.value
    }, 0),
    duration: response.routes[0].legs.reduce((accum: number, leg: any) => {
      return accum + leg.duration.value
    }, 0),
    id: 'routeGOOGLE',
    parsedValue: response,
    routePath: [
      polyline.decode(tripPolyline).map(coord => ({ lat: coord[0], lon: coord[1] }))
    ]
  }
}

export const routeConverterFromOSRM = (response: OSRMRouteResponse, id = nanoid()) => {
  return {
    distance: response.routes.reduce((accum, route) => {
      return accum + route.distance
    }, 0),
    duration: response.routes.reduce((accum, route) => {
      return accum + route.duration
    }, 0),
    id,
    parsedValue: response,
    routePath: response.routes[0].legs.reduce(
      (legPath: Coords2[][], leg: OSRMRouteLeg) => {
        return [
          ...legPath,
          leg.steps.reduce((stepPath: Coords2[], step) => {
            const path = polyline
              .decode(step.geometry)
              .map(coord => ({ lat: coord[0], lon: coord[1] }))
            return [...stepPath, ...path]
          }, [])
        ]
      },
      []
    ),
    type: 'Route'
  }
}
