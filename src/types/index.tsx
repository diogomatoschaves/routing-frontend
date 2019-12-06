// Functions
import * as React from 'react'

export type UpdatePoint = (index: number[], coords: Coords[]) => void
export type UpdateState = (stateKey: string, value: any) => void
export type HandleChange = ({ id, value }: { id: string; value: any }) => boolean
export type HandleValueUpdate = ({ id, value }: { id: string; value: any }) => boolean
export type HandleConfirmButton = (setState: any, value: any, id: string) => void
export type HandleAddRoute = (route: Route) => void
export type HandleDeleteRoute = (id: string) => void
export type WaitTillLoaded = (loadedProp: boolean) => Promise<boolean>
export type GetRoutes = (
  locations: LocationInfo[],
  profile: string,
  authorization: string,
  googleMapsOption: boolean,
  google: any,
  trafficOption: boolean,
  defaultOption: boolean,
  endpointUrl: string
) => Promise<unknown[]> | Promise<void>
export type UpdateStateCallback = (callback: any) => Promise<void>

// Objects
export interface LocationInfo extends Location {
  name: string
  marker: string
  markerOffset?: number[]
  placeholder: string
  [key: string]: string | number[] | number | Bearing | undefined | null
}

export interface Coords {
  lat: null | number
  lon: null | number
}

export interface Coords2 {
  lat: number
  lon: number
}

interface Bearing {
  degree: number
  range: number
}

export interface Location extends Coords {
  bearing?: Bearing
  radius?: number
}

export interface Responses {
  routeResponse: RouteResponse
  trafficResponse: RouteResponse
  googleResponse: GoogleResponse
  matchResponse: MatchResponse
  [key: string]: RouteResponse | GoogleResponse | MatchResponse | undefined
}

export interface Messages {
  routeMessage: React.ReactNode | null
  trafficMessage: React.ReactNode | null
  googleMessage: React.ReactNode | null
}

export interface RouteResponse {
  code: string
  routes: Array<{
    totalDistance: number
    totalDuration: number
    legs: RouteLeg[]
  }>
  locations?: Array<{
    snapDistance?: number
    location: Coords2
  }>
  message?: string
}

export interface RouteLeg {
  duration: number
  distance: number
  geometry: Coords2[]
}

export interface GoogleResponse {
  geocoded_waypoints?: any[]
  routes: any[]
  status: string
}

export interface MatchResponse {
  code: string
  matchings: Matching[]
  tracepoints: Tracepoint[]
}

export interface Tracepoint {
  snapDistance: number
  location: Coords2
}

export interface Matching {
  confidence?: number
  legs: MatchLeg[]
}

export interface MatchLeg {
  traceFromIndex: number
  traceToIndex: number
  duration: number
  distance: number
  nodes?: number[]
  geometry: Coords2[]
}

export interface Dict {
  [key: string]: string
}

export interface Geography {
  text: string
  coords: number[]
  polygon: string
  value: number
}

export interface MapboxStyle {
  type: string
  endpoint: string
}

export interface Body {
  locations: Location[]
  reportGeometry: boolean
  reportNodes?: true
}
export interface Route {
  id: string
  distance: number
  duration: number
  routePath: Coords2[]
  type?: string
  parsedValue?: any
}

export interface Routes {
  route: Route
  trafficRoute: Route
  googleRoute: Route
  [key: string]: Route
}

export interface Option {
  key: string
  text: string
  value: number
}

export interface GeographiesHandler {
  options: Geography[]
  activeIdx: number
}

export interface OptionsHandler {
  options: Option[]
  activeIdx: number
}

export interface ResponseOptionsHandler {
  options: Array<{
    key: string
    text: string
    value: number
  }>
  activeIdx: number
}

export interface RouteProperty {
  id: string
  color: string
  routeId: string
  width: number
  routingGraphVisible: boolean
}

export interface ResponseDB {
  exists: boolean
  routes: RouteSchema[]
}

export interface RouteSchema {
  id: string
  eta: number
  distance: number
  provider: {
    name: string
    type: string
    url: string
  }
  source: {
    name: string
  }
  waypoints: {
    origin: number[]
    destination: number[]
    middlePoints: number[][]
  }
  geometry: {
    type: string
    coordinates: number[][]
  }
  ata: number
  confidence: number
  date: string
}

export interface InputValues {
  route: string
  match: string
  response: string
  body: string
  [key: string]: string
}

export interface InputColors {
  route: string
  match: string
  body: string
  [key: string]: string
}

export interface ProfileItem {
  iconName: string
  name: string
}
