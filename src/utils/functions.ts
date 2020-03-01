import JSON5 from 'json5'
import { Validator } from 'jsonschema'
import round from 'lodash/round'
import {
  Coords,
  Coords2,
  Location,
  LocationInfo,
  Route,
  UpdatePoint,
  UpdateState,
  UpdateStateCallback
} from '../types'
import { END_MARKER, START_MARKER, WAYPOINT_MARKER } from './colours'
import {
  defaultBody,
  defaultGoogleResponse,
  defaultMatchResponse,
  defaultRoute,
  defaultRouteResponse,
  destinationTemplate,
  layersArray,
  waypointTemplate
} from './input'
import { Schema } from './schemas'

export const stringToBoolean = (str: string) => {
  switch (str.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true
    default:
      return false
  }
}

export const formatCoords = (coords: Coords) =>
  coords.lat && coords.lon ? `${round(coords.lat, 7)}, ${round(coords.lon, 7)}` : ''

export const splitCoords = (value: string): Coords | null => {
  const [lat, lon] = value.split(',')

  const coords = {
    lat: Number(lat),
    lon: Number(lon)
  }

  return coords.lat && coords.lon ? coords : null
}

export const transformPoints = (array: Coords2[]) => {
  return array.map(point => [point.lon, point.lat])
}

export const transformToObject = (array: number[][]): Coords2[] => {
  return array.map(point => ({
    lat: point[1],
    lon: point[0]
  }))
}

export const getRequestBody = (locations: LocationInfo[]) => {
  return {
    locations: locations.reduce((accum: Location[], location: LocationInfo) => {
      return location.lat && location.lon
        ? [
            ...accum,
            {
              ...(location.bearing && { bearing: location.bearing }),
              lat: location.lat,
              lon: location.lon,
              ...(location.radius && { radius: location.radius })
            }
          ]
        : accum
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

export const getSpeedsLayers = (sourceName: string, extraFilter: string[] | null) => {
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
    (match: any) => {
      let cls = 'number'
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

  if (r > 255) {
    r = 255
  } else if (r < 0) {
    r = 0
  }

  let b = ((num >> 8) & 0x00ff) + amt

  if (b > 255) {
    b = 255
  } else if (b < 0) {
    b = 0
  }

  let g = (num & 0x0000ff) + amt

  if (g > 255) {
    g = 255
  } else if (g < 0) {
    g = 0
  }

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
  setState: UpdateStateCallback
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
  const validation = validator.validate(parsedValue, Schema[service][inputType])
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
  addedRoutes: Route[]
) => {
  const newAddedRoutes = [...addedRoutes, route]

  updateState('addedRoutes', newAddedRoutes)
}

const processValidResponse2 = (
  updateState: UpdateState,
  updatePoint: UpdatePoint,
  responseOption: string,
  locations: LocationInfo[],
  parsedValue: any
) => {
  const points: any = {
    start: parsedValue.locations[0].location,
    end: parsedValue.locations.slice(-1)[0].location
  }

  if (
    [locations[0], locations.slice(-1)[0]].some(el => {
      return el.lat !== points[el.name].lat || el.lon !== points[el.name].lon
    })
  ) {
    new Promise(resolve => {
      resolve(updateState('recalculate', false))
    }).then(value => {
      updatePoint(
        [0, 1],
        [
          { lat: points.start.lat, lon: points.start.lon },
          { lat: points.end.lat, lon: points.end.lon }
        ]
      )
    })

    updateState(responseOption === 'normal' ? 'response' : 'trafficResponse', parsedValue)
  }
}

export const processValidBody = (
  updatePoint: UpdatePoint,
  locations: LocationInfo[],
  parsedValue: any
) => {
  const points: { start: Location; end: Location } = {
    start: parsedValue.locations[0],
    end: parsedValue.locations.slice(-1)[0]
  }

  // if (
  //   [locations[0], locations.slice(-1)[0]].some(el => {
  //     return (
  //       el.lat !== points[el.name].lat ||
  //       el.lon !== points[el.name].lon ||
  //       el.bearing !== points[el.name].bearing ||
  //       el.radius !== points[el.name].radius
  //     )
  //   })
  // ) {

  updatePoint([0, 1], [points.start, points.end])
  // }
}

export function checkNested(obj: any, ...rest: any): boolean {
  if (obj === undefined) {
    return false
  }
  if (rest.length === 1 && obj.hasOwnProperty(rest[0])) {
    return true
  }
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
    profile: 'driving',
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
        markerColor: START_MARKER,
        markerOffset: [0, 5],
        placeholder: 'Origin',
        lat: null,
        lon: null
      },
      {
        name: 'end',
        marker: 'map marker alternate',
        markerColor: END_MARKER,
        markerOffset: [0, 5],
        placeholder: 'Destination',
        lat: null,
        lon: null
      }
    ],
    endpointHandler: {
      options: [
        { key: 'localhost', text: 'http://localhost:5000', value: 0 },
        {
          key: 'osrm-backend',
          text: 'https://router.project-osrm.org',
          value: 1
        }
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
        { key: 'match', text: 'Match Response', value: 1 }
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
        {
          text: 'Berlin',
          coords: [13.38408, 52.51721],
          polygon: 'berlin.geojson',
          value: 0
        },
        {
          text: 'Stuttgart',
          coords: [9.033, 48.7111],
          polygon: 'stuttgart.geojson',
          value: 1
        },
        {
          text: 'Immendingen',
          coords: [8.7214, 47.912],
          polygon: 'immendingen.geojson',
          value: 2
        },
        {
          text: 'South Bay',
          coords: [-121.97588, 37.34606],
          polygon: 'south_bay.geojson',
          value: 3
        }
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
      match: 'rgb(100, 100, 100)',
      body: 'rgb(100, 100, 100)'
    },
    routeHighlight: '',
    showMessage: false,
    messages: {
      googleMessage: null,
      routeMessage: null,
      trafficMessage: null
    },
    messageBottomProp: -300,
    loading: false,
    prevCoordsString: '',
    dropEvent: true,
    tempRoute: null,
    tempRoutePath: null,
  }
}

export const getAppProps = () => {
  return {
    animationDuration: { show: 500, hide: 100 },
    defaultColor: 'rgb(100, 100, 100)',
    profiles: [
      {
        iconName: 'car',
        name: 'driving'
      },
      {
        iconName: 'male',
        name: 'foot'
      },
      {
        iconName: 'bicycle',
        name: 'bike'
      }
    ]
  }
}

export const findDiff: any = (object1: any, object2: any) => {
  return Object.keys(object1).reduce((accum, value) => {
    if (object1[value] !== object2[value]) {
      return {
        ...accum,
        [value]: object1[value]
      }
    } else {
      return accum
    }
  }, {})
}

export const getWaypoint = (lat: number | null, lon: number | null) => {
  return {
    ...waypointTemplate,
    lat,
    lon
  }
}

export const addWaypoint = (locations: LocationInfo[]) => {
  const lastWaypoint = locations.slice(-1)[0]
  return [
    ...locations.slice(0, -1),
    getWaypoint(lastWaypoint.lat, lastWaypoint.lon),
    destinationTemplate
  ]
}

export const reorderWaypoints = (
  locations: LocationInfo[],
  indexFrom: number,
  indexTo: number
) => {
  if (indexFrom < indexTo) {
    return [
      ...locations.slice(0, indexFrom),
      ...locations.slice(indexFrom + 1, indexTo + 1),
      locations[indexFrom],
      ...locations.slice(indexTo + 1)
    ]
  }

  return [
    ...locations.slice(0, indexTo),
    locations[indexFrom],
    ...locations.slice(indexTo, indexFrom),
    ...locations.slice(indexFrom + 1)
  ]
}

export const sortWaypoints = (locations: LocationInfo[]) => {
  return locations.map((location: LocationInfo, index: number) => {
    if (index === 0) {
      return {
        ...location,
        name: 'start',
        marker: 'map marker alternate',
        markerColor: START_MARKER,
        markerOffset: [0, 5],
        placeholder: 'Origin'
      }
    } else if (!locations[index + 1]) {
      return {
        ...location,
        name: 'end',
        marker: 'map marker alternate',
        markerColor: END_MARKER,
        markerOffset: [0, 5],
        placeholder: 'Destination'
      }
    } else {
      return {
        ...location,
        name: 'waypoint',
        marker: '',
        markerColor: WAYPOINT_MARKER,
        markerOffset: [0, 5],
        placeholder: 'Waypoint'
      }
    }
  })
}

export const removeWaypoint = (locations: LocationInfo[], indexToRemove: number) => {
  const prunedLocations = locations.reduce(
    (accum: LocationInfo[], location: LocationInfo, index: number) => {
      if (index !== indexToRemove) {
        return [...accum, location]
      } else {
        return accum
      }
    },
    []
  )
  return sortWaypoints(prunedLocations)
}

export const atLeastTwoLocations = (locations: LocationInfo[]) => {
  let count = 0

  locations.forEach((el: LocationInfo) => {
    if (el.lat && el.lon) {
      count++
    }
  })
  return count >= 2
}

export const getCoordsString = (locations: LocationInfo[]) =>
  locations
    .reduce((accum: string[], loc: Location) => {
      return loc.lat && loc.lon ? [...accum, `${loc.lon},${loc.lat}`] : accum
    }, [])
    .join(';')
