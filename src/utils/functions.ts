import round from 'lodash/round'
import { Coords, Coords2 } from '../types'

export const formatCoords = (coords: Coords) => coords.lat && coords.lng ? `${round(coords.lat, 3)}, ${round(coords.lng, 3)}` : ''

export const transformPoints = (array: Array<Coords2>) => {
  return array.map(point => [point.lon, point.lat])
}