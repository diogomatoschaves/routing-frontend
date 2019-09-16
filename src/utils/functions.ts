import round from 'lodash/round'
import { Coords, Coords2, Location, UpdateState, UpdatePoint, Route } from '../types'
import { layersArray, defaultGoogleResponse } from '../utils/input'
import { Validator } from 'jsonschema'
import { Schema } from './schemas'
import JSON5 from 'json5'
import nanoid from 'nanoid'
import {
  defaultRouteResponse,
  defaultRoute,
  defaultMatchResponse,
  defaultBody
} from '../utils/input'

export const getPath = (pathname: string) => {
  const matching = ['/:profile', '/:start', '/:end']
  const splitUrl = pathname.split('/')

  let usedIndex = -1
  const path =
    splitUrl.length > 4
      ? ''
      : splitUrl.reduce((accum: string, item: string, index: number) => {
          if (item) {
            usedIndex++
            return accum + matching[usedIndex]
          } else return accum
        }, '')

  return path
}

export const formatCoords = (coords: Coords) =>
  coords.lat && coords.lng ? `${round(coords.lat, 7)}, ${round(coords.lng, 7)}` : ''

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

export const transformToObject = (array: number[][]): Array<Coords2> => {
  return array.map(point => ({
    lat: point[1],
    lon: point[0]
  }))
}

export const getRequestBody = (locations: Array<Location>) => {
  return {
    locations: locations.reduce((accum: Array<Coords2>, location: Location) => {
      return [
        ...accum,
        {
          lat: location.lat ? location.lat : 0,
          lon: location.lng ? location.lng : 0
        }
      ]
    }, []),
    reportGeometry: true
  }
}

export const computeDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600) >= 1 ? round(duration / 3600, 1) : 0
  const minutes = Math.floor(duration / 60) >= 1 ? Math.round(duration / 60) : 0
  const seconds = round(duration % 60)

  if (hours !== 0) {
    return [hours, hours === 1 ? 'hour' : 'hours']
  } else if (minutes !== 0) {
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

export const getSpeedsLayers = (
  sourceName: string,
  extraFilter: Array<string> | null
) => {
  return layersArray.map((layer: any) => ({
    ...layer,
    source: sourceName,
    id: `${sourceName} ${layer.id}`,
    filter: extraFilter
      ? layer.filter.includes('all')
        ? ['all', layer.filter[1], [...layer.filter[2]], extraFilter]
        : layer.filter
      : layer.filter
  }))
}

const syntaxHighlight = (json: any) => {
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function(match: any) {
      var cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    }
  )
}

export const lightenDarkenColor = (col: string, amt: number) => {
  let usePound = false

  if (col[0] === '#') {
    col = col.slice(1)
    usePound = true
  }

  const num = parseInt(col, 16)

  let r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let b = ((num >> 8) & 0x00ff) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  let g = (num & 0x0000ff) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const validateJSON = (
  value: any,
  validator: Validator,
  service: string,
  inputType: string,
  inputId: string,
  defaultColor: string,
  setState: any
) => {
  let parsedValue
  try {
    parsedValue = JSON5.parse(value)
  } catch (error) {
    console.log('Invalid JSON')
    setState((state: any) => ({
      ...state,
      inputColors: {
        ...state.inputColors,
        [inputId]: value === '' ? defaultColor : 'red'
      }
    }))
    return false
  }
  const validation = validator.validate(
    parsedValue,
    Schema[service][inputType]
  )
  if (validation.valid) {
    setState((state: any) => ({
      ...state,
      inputColors: {
        ...state.inputColors,
        [inputId]: defaultColor
      }
    }))
    return true
  } else {
    process.env.NODE_ENV !== 'test' && console.log(validation)
    setState((state: any) => ({
      ...state,
      inputColors: {
        ...state.inputColors,
        [inputId]: 'red'
      }
    }))
    return false
  }
}

export const processValidResponse = (
  updateState: UpdateState,
  route: Route,
  addedRoutes: Array<Route>
) => {
  const newAddedRoutes = [...addedRoutes, route]

  updateState('addedRoutes', newAddedRoutes)
}

const processValidResponse2 = (
  updateState: UpdateState,
  updatePoint: UpdatePoint,
  responseOption: string,
  locations: Array<Location>,
  parsedValue: any
) => {
  const points: any = {
    start: parsedValue.locations[0].location,
    end: parsedValue.locations.slice(-1)[0].location
  }

  if (
    [locations[0], locations.slice(-1)[0]].some(el => {
      return el.lat !== points[el.name].lat || el.lng !== points[el.name].lon
    })
  ) {
    new Promise(resolve => {
      resolve(updateState('recalculate', false))
    }).then(value => {
      updatePoint(
        [0, 1],
        [
          { lat: points.start.lat, lng: points.start.lon },
          { lat: points.end.lat, lng: points.end.lon }
        ]
      )
    })

    updateState(responseOption === 'normal' ? 'response' : 'trafficResponse', parsedValue)
  }
}

export const processValidBody = (
  updatePoint: UpdatePoint,
  locations: Array<Location>,
  parsedValue: any
) => {
  const points: any = {
    start: parsedValue.locations[0],
    end: parsedValue.locations.slice(-1)[0]
  }

  if (
    [locations[0], locations.slice(-1)[0]].some(el => {
      return el.lat !== points[el.name].lat || el.lng !== points[el.name].lon
    })
  ) {
    updatePoint(
      [0, 1],
      [
        { lat: points.start.lat, lng: points.start.lon },
        { lat: points.end.lat, lng: points.end.lon }
      ]
    )
  }
}

export function checkNested(obj: any, ...rest: any): boolean {
  if (obj === undefined) return false
  if (rest.length === 1 && obj.hasOwnProperty(rest[0])) return true
  return checkNested(obj[rest[0]], rest.slice(1))
}

export const getAppState = () => {
  return {
    validator: new Validator(),
    debug: false,
    selectedService: 0,
    recalculate: true,
    initialUpdate: false,
    body: defaultBody,
    mapLoaded: false,
    visible: false,
    routingGraphVisible: false,
    polygonsVisible: false,
    googleMapsOption: false,
    trafficOption: false,
    profile: 'car',
    geography: {
      text: 'Berlin',
      coords: [13.38408, 52.51721],
      polygon: 'berlin.geojson',
      value: 0
    },
    recenter: false,
    expanded: false,
    authorization: '',
    google: null,
    routes: {
      googleRoute: defaultRoute,
      route: defaultRoute,
      trafficRoute: defaultRoute
    },
    responses: {
      routeResponse: defaultRouteResponse,
      trafficResponse: defaultRouteResponse,
      googleResponse: defaultGoogleResponse,
      matchResponse: defaultMatchResponse
    },
    locations: [
      {
        name: 'start',
        marker: 'map marker alternate',
        markerOffset: [0, 5],
        placeholder: 'Origin',
        lat: null,
        lng: null
      },
      {
        name: 'end',
        marker: 'map marker',
        markerOffset: [0, 5],
        placeholder: 'Destination',
        lat: null,
        lng: null
      }
    ],
    endpointHandler: {
      options: [
        {
          key: 'develop',
          text: 'https://routing.develop.otonomousmobility.com/${PROFILE}',
          value: 0
        },
        {
          key: 'staging',
          text: 'https://routing.staging.otonomousmobility.com/${PROFILE}',
          value: 1
        },
        {
          key: 'testing',
          text: 'https://routing.testing.otonomousmobility.com/${PROFILE}',
          value: 2
        },
        { key: 'localhost', text: 'http://localhost:5000', value: 3 }
      ],
      activeIdx: 0
    },
    modeTabsHandler: {
      options: [
        { key: 'default', text: 'Interactive', value: 0 },
        { key: 'debug', text: 'Debugging', value: 1 }
      ],
      activeIdx: 0
    },
    addDataTabsHandler: {
      options: [
        { key: 'route', text: 'Route Response', value: 0 },
        { key: 'match', text: 'Match Response', value: 1 },
        { key: 'db', text: 'Load from DB', value: 2 }
      ],
      activeIdx: 0
    },
    responseOptionsHandler: {
      options: [
        { key: 'routeResponse', text: 'No Traffic', value: 0 },
        { key: 'trafficResponse', text: 'w/ Traffic', value: 1 },
        { key: 'googleResponse', text: 'Google', value: 2 }
      ],
      activeIdx: 0
    },
    geographies: {
      options: [
        { text: 'Berlin', coords: [13.38408, 52.51721], polygon: 'berlin.geojson', value: 0 },
        { text: 'Stuttgart', coords: [9.033, 48.7111], polygon: 'stuttgart.geojson', value: 1 },
        { text: 'Immendingen', coords: [8.7214, 47.912], polygon: 'immendingen.geojson', value: 2 },
        { text: 'South Bay', coords: [-121.97588, 37.34606], polygon: 'south_bay.geojson', value: 3 }
      ],
      activeIdx: 0
    },
    bodyEdit: false,
    responseEdit: false,
    addedRoutes: [],
    inputValues: {
      route: '',
      match: '',
      body: '',
      response: ''
    },
    inputColors: {
      route: 'rgb(100, 100, 100)',
      match:  'rgb(100, 100, 100)',
      body: 'rgb(100, 100, 100)'
    },
    routeHighlight: '',
    showMessage: false,
    messages: {
      routeMessage: null,
      trafficMessage: null,
      googleMessage: null
    },
    messageBottomProp: -300
  }
}

export const getAppProps = () => {
  return {
    urlParams: {
      matching: ['', '/:profile', '/:start', '/:end'],
      requiredParams: {
        profile: 'profile',
        start: 'start',
        end: 'end'
      },
      acceptableProfiles: ['car', 'foot']
    },
    animationDuration: { show: 500, hide: 100 },
    defaultColor: 'rgb(100, 100, 100)'
  }
}
