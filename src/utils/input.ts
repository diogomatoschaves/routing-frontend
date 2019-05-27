import { POLYLINE_COLOR } from './colours'

export const exampleLine = [
  {"lon":13.41438,"lat":52.532085},
  {"lon":13.415716,"lat":52.531629},
  {"lon":13.418687,"lat":52.530622},
  {"lon":13.418743,"lat":52.530605},
  {"lon":13.418881,"lat":52.530572},
  {"lon":13.418881,"lat":52.530572},
  {"lon":13.418972,"lat":52.530568},
  {"lon":13.419028,"lat":52.530566},
  {"lon":13.419131,"lat":52.530561},
  {"lon":13.419252,"lat":52.530691},
  {"lon":13.419578,"lat":52.531113},
  {"lon":13.419894,"lat":52.531635},
  {"lon":13.419954,"lat":52.53173},
  {"lon":13.420001,"lat":52.53181},
  {"lon":13.420358,"lat":52.532407},
  {"lon":13.420358,"lat":52.532407},
  {"lon":13.421421,"lat":52.532169},
  {"lon":13.423145,"lat":52.531528},
  {"lon":13.423145,"lat":52.531528},
  {"lon":13.423135,"lat":52.531517},
  {"lon":13.423135,"lat":52.531517},
  {"lon":13.423135,"lat":52.531517}
]

export const emptyLineString = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      // "coordinates": transformPoints(exampleLine)
      "coordinates": []
    }
  }]
}

export const routeLineSettings = {
  'id': 'line-animation',
  'type': 'line',
  'layout': {
    'line-cap': 'round',
    'line-join': 'round'
  },
  'paint': {
    'line-color': POLYLINE_COLOR,
    // 'line-color': '#ed6498',
    'line-width': 5,
    'line-opacity': .8
  }
}



