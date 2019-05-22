

// Functions
export type UpdatePoint = (index: number, coords: Coords) => void
export type UpdateColor = () => void

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
