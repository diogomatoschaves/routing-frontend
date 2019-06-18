import round from 'lodash/round'
import { Coords, Coords2 } from '../types'
import { layersArray } from '../utils/input'

export const formatCoords = (coords: Coords) => coords.lat && coords.lng ? `${round(coords.lat, 7)}, ${round(coords.lng, 7)}` : ''

export const transformPoints = (array: Array<Coords2>) => {
  return array.map(point => [point.lon, point.lat])
}

export const computeDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600) >= 1 ? round(duration / 3600, 1) : 0
  const minutes = Math.floor(duration / 60) >= 1 ? Math.round(duration / 60) : 0
  const seconds = round(duration % 60)

  if (hours !== 0) {
    return [hours, hours === 1 ? 'hour' : 'hours']
  } else if (minutes !== 0){
    return [minutes, minutes === 1 ? 'minute' : 'minutes']
  } else {
    return [seconds, seconds === 1 ? 'second' : 'seconds']
  }
}

export const computeDistance = (distance: number) => {
  const km = Math.floor(distance / 1000) >= 1 ? round(distance / 1000, 1) : 0
  const meters = round(distance % 1000)

  if (km !== 0) {
    return [km, 'km']
  } else {
    return [meters, meters === 1 ? 'meter' : 'meters']
  }
}

export const getSpeedsLayers = (sourceName: string, extraFilter: Array<string> | null) => {
  return layersArray.map((layer: any) => ({
    ...layer,
    source: sourceName,
    id: `${sourceName} ${layer.id}`,
    filter: extraFilter ? layer.filter.includes('all') ? [
      'all',
      layer.filter[1],
      [
        ...layer.filter[2],
      ],
      extraFilter
    ] : layer.filter : layer.filter
  }))
}

export const lightenDarkenColor = (col: string, amt: number) => {
  
  let usePound = false;

  if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
  }

  const num = parseInt(col,16);

  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if  (r < 0) r = 0;

  let b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if  (b < 0) b = 0;

  let g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}