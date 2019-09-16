

// Functions
export type UpdatePoint = (index: number[], coords: Array<Coords>) => void
export type UpdateColor = () => void
export type UpdateState = (stateKey: string, value: any) => void
export type HandleChange = ({ id, value }: { id: string, value: any }) => boolean
export type HandleValueUpdate = ({ id, value }: { id: string, value: any }) => boolean
export type HandleConfirmButton = (setState: any, value: any, id: string) => void
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

export type Responses = {
  routeResponse: RouteResponse
  trafficResponse: RouteResponse
  googleResponse: GoogleResponse
  matchResponse: MatchResponse
  [key: string]: RouteResponse | GoogleResponse | MatchResponse | undefined
}

export type Messages = {
  routeMessage: React.ReactNode | null
  trafficMessage: React.ReactNode | null
  googleMessage: React.ReactNode | null
}

export type RouteResponse = {
  code: string,
  routes: Array<{
    totalDistance: number
    totalDuration: number
    legs: Array<RouteLeg>
  }>
  locations?: Array<{
    snapDistance?: number
    location: Coords2
  }>
  message?: string
}

export type RouteLeg = {
  duration: number
  distance: number
  geometry: Array<Coords2>
}

export type GoogleResponse = {
  geocoded_waypoints?: Array<any>,
  routes: Array<any>,
  status: string
}

export type MatchResponse = {
  code: string,
  matchings: Array<Matching>,
  tracepoints: Array<Tracepoint>
}

export type Tracepoint = {
  snapDistance: number,
  location: Coords2
}

export type Matching = {
  confidence?: number
  legs: Array<MatchLeg>
}

export type MatchLeg = {
  traceFromIndex: number
  traceToIndex: number
  duration: number
  distance: number
  nodes?: Array<number>
  geometry: Array<Coords2>
}

export type Dict = { [key: string]: string };

export type Geography = {
  text: string,
  coords: Array<number>,
  polygon: string,
  value: number
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
  routePath: Array<Coords2>
  type?: string
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

export type GeographiesHandler = {
  options: Array<Geography>,
  activeIdx: number
}

export type OptionsHandler = {
  options: Array<Option>,
  activeIdx: number
}

export type ResponseOptionsHandler = {
  options: Array<{
    key: string
    text: string
    value: number
  }>,
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

export type InputValues = {
  route: string
  match: string
  response: string
  body: string
  [key: string]: string
}

export type InputColors = {
  route: string
  match: string
  body: string
  [key: string]: string
}