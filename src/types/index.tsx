

// Functions
export type UpdatePoint = (index: number[], coords: Array<Coords>) => void
export type UpdateColor = () => void
export type UpdateState = (stateKey: string, value: any) => void
export type HandleChange = ({ id, value }: { id: string, value: any }) => boolean
export type HandleConfirmButton = (setState: any, value: any ) => void
export type HandleAddRoute = (route: Route) => void 
export type HandleDeleteRoute = (id: string) => void 

//Objects
export type Location = {
  name: string, 
  marker: string,
  markerOffset?: Array<number>
  placeholder: string,
  lat: null | number
  lng: null | number
}

export type Coords = {
  lat: null | number,
  lng: null | number,
}

export type Coords2 = {
  lat: number,
  lon: number,
}

export type RouteResponse = {
  code: string,
  routes: Array<any>,
  locations: Array<any>
}

export type GoogleResponse = {
  geocoded_waypoints?: Array<any>,
  routes: Array<any>,
}

export type MatchResponse = {
  code: string,
  matchings: Array<any>,
  tracepoints: Array<any>
}

export type Dict = { [key: string]: string };

export type Geography = {
  name: string,
  coords: Array<number>,
  polygon: string
}

export type MapboxStyle = { 
  type: string, 
  endpoint: string
}

export type Body = {
  locations: Array<Coords2>,
  reportGeometry: boolean,
  reportNodes?: true
}
export type Route = {
  id: string
  distance: number
  duration: number
  routePath: Array<Coords2>,
  parsedValue?: any
}

export type Routes = {
  route: Route
  trafficRoute: Route
  googleRoute: Route
  [key: string]: Route;
}

export type Option = {
  key: string,
  text: string,
  value: number
}

export type OptionsHandler = {
  options: Array<Option>,
  activeIdx: number
}

export type RouteProperty = {
  id: string
  color: string
  routeId: string
  width: number
  routingGraphVisible: boolean
}

export type ResponseDB = {
  exists: boolean
  routes: Array<RouteSchema>
}

export type RouteSchema = { 
  id: string, 
  eta: number,
  distance: number
  provider: {
    name : string,
    type : string,
    url: string,
  },
  source: {
    name : string,
  },
  waypoints: {
    origin: number[],
    destination: number[],
    middlePoints : number[][]
  },
  geometry: {
    type: string, 
    coordinates: number[][]},
  ata: number,
  confidence: number,
  date: string
}

export type RoutingServiceResponse = {
  code: string,
  routes: Array<{
    totalDistance: number
    totalDuration: number
    legs: Array<{
      duration: number
      distance: number
      geometry: Array<Coords2>
    }>
  }>
  locations?: Array<{
    snapDistance?: number
    location: Coords2
  }>
}