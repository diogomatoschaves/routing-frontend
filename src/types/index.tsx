

// Functions
export type UpdatePoint = (index: number, coords: Coords) => void
export type UpdateColor = () => void
export type UpdateState = (stateKey: string, value: any) => void

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

export type Response = {
  code: string,
  routes: Array<any>,
  locations: Array<any>
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

export type Route = {
  distance: number,
  duration: number,
  routePath: Array<Coords2>
}
