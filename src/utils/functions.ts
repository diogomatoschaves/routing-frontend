import round from 'lodash/round'
import { Coords, Coords2, Location } from '../types'
import { layersArray } from '../utils/input'

export const getPath = (pathname: string) => {
  const matching = ['/:profile', '/:start', '/:end']
  const splitUrl = pathname.split('/')

  let usedIndex = -1
  const path = splitUrl.length > 4 ? '' : splitUrl.reduce((accum: string, item: string, index: number) => {
    if (item) {
      usedIndex++
      return accum + matching[usedIndex]
    } else return accum
  }, '')

  return path
}

export const formatCoords = (coords: Coords) => coords.lat && coords.lng ? `${round(coords.lat, 7)}, ${round(coords.lng, 7)}` : ''

export const splitCoords = (value: string): Coords | null => {
  const [lat, lng] = value.split(',')
  
  const coords = { 
    lat: Number(lat), 
    lng: Number(lng) 
  }

  return coords.lat && coords.lng ? coords : null
}

export const transformPoints = (array: Array<Coords2>) => {
  return array.map(point => [point.lon, point.lat])
}

export const getRequestBody = (locations: Array<Location>) => {
  return {
    locations: locations.reduce((accum: Array<Coords2>, location: Location) => {
      return [
        ...accum, {
          lat: location.lat ? location.lat : 0, 
          lon: location.lng ? location.lng : 0
        }
      ]
    }, []), 
    reportGeometry: true,
  }
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

const syntaxHighlight = (json: any) => {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match: any) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}