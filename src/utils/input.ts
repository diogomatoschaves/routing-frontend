import { POLYLINE_COLOR, colors } from './colours'

export const defaultBody = {
  locations: [],
  reportGeometry: true,
}

export const defaultRouteResponse = {
  code: 'Ok',
  routes: [{ 
    legs: [{ 
      geometry: [],
      duration: 0,
      distance: 0
    }]
  }],
  locations: []
}

export const defaultMatchResponse = {
  code: 'Ok',
  matchings: [{
    confidence: 0,
    legs: [{ 
      geometry: [],
      duration: 0,
      distance: 0,
      nodes: [],
      traceFromIndex: 0,
      traceToIndex: 0
    }]
  }],
  tracepoints: []
}

export const defaultRoute = {
  id: '',
  duration: 0,
  distance: 0,
  routePath: [{ lat: 0, lon: 0}]
}

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
    'line-width': 6.5,
    'line-opacity': 0.55
  }
}

// TODO: Adapt tile endpoint based on profile
export const speedTilesInput = [{
    name: 'Routing-Service Graph',
    id: 'speeds',
    type: 'speeds',
  }]

export const layersArray = [
    {
      'id': 'nodes',
      'type': 'symbol',
      'source': 'speeds',
      "source-layer": "speeds",
      'filter': ["==", "$type", "Point"],
      'paint': {
        "text-color": "#000000"
      },
      "layout": {
        "text-field": "{uuid}",
        "text-offset": [0, 0.6],
        "text-anchor": "top",
        'text-size': {
          stops: [
            [18, 0],
            [22, 25]
          ]
        },
      }
    },
    {
      'id': 'points',
      "minzoom": 11,
      'type': 'circle',
      'source': 'speeds',
      "source-layer": "speeds",
      'filter': ["==", "$type", "Point"],
      'paint': {
        'circle-color': '#0000FF',
        'circle-opacity': 0.75,
        'circle-radius': {
          'base': 2.75,
          'stops': [[15, 2], [22, 10]]
        },
      }
    },
    {
    "minzoom": 11,
    "layout": {
        "visibility": "visible",
        "line-cap": "round"
    },
    "metadata": {},
    "filter": [
        "==",
        "$type",
        "LineString"
    ],
    "type": "line",
    "source": "speeds",
    "id": "outline",
    "paint": {
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    4
                ],
                [
                    14,
                    6
                ],
                [
                    18,
                    24
                ]
            ]
        },
        "line-color": "hsl(0, 0%, 0%)",
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds",
    "interactive": true
  },
  {
    "minzoom": 11,
    "layout": {
        "visibility": "visible",
        "line-cap": "round"
    },
    "metadata": {},
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "==",
            "is_small",
            true
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "small components",
    "paint": {
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    6
                ],
                [
                    14,
                    8
                ],
                [
                    18,
                    28
                ]
            ]
        },
        // "line-color": "#ff37ef",
        "line-color": "#FFFFFF",
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds",
    "interactive": true
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "visibility": "visible",
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "<=",
            "speed",
            10
        ],
    ],
    "type": "line",
    "source": "speeds",
    "id": "< 10",
    "paint": {
        "line-color": colors['< 10'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "all",
            [
                "<=",
                "speed",
                20
            ],
            [
                ">",
                "speed",
                10
            ],
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "10-20",
    "paint": {
        "line-color": colors['10-20'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "all",
            [
                "<=",
                "speed",
                30
            ],
            [
                ">",
                "speed",
                20
            ],
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "20-30",
    "paint": {
        "line-color": colors['20-30'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "all",
            [
                "<=",
                "speed",
                40
            ],
            [
                ">",
                "speed",
                30
            ]
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "30-40",
    "paint": {
        "line-color": colors['30-40'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "all",
            [
                "<=",
                "speed",
                50
            ],
            [
                ">",
                "speed",
                40
            ]
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "40-50",
    "paint": {
        "line-color": colors['40-50'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "all",
            [
                "<=",
                "speed",
                60
            ],
            [
                ">",
                "speed",
                50
            ]
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "50-60",
    "paint": {
        "line-color": colors['50-60'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "all",
            [
                "<=",
                "speed",
                70
            ],
            [
                ">",
                "speed",
                60
            ]
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "60-70",
    "paint": {
        "line-color": colors['60-70'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "all",
            [
                "<=",
                "speed",
                80
            ],
            [
                ">",
                "speed",
                70
            ]
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "70-80",
    "paint": {
        "line-color": colors['70-80'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            "all",
            [
                "<=",
                "speed",
                90
            ],
            [
                ">",
                "speed",
                80
            ]
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "80-90",
    "paint": {
        "line-color": colors['80-90'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "interactive": true,
    "minzoom": 11,
    "layout": {
        "line-cap": "round"
    },
    "metadata": {
        "mapbox:group": "1457989050091.615"
    },
    "filter": [
        "all",
        [
            "==",
            "$type",
            "LineString"
        ],
        [
            ">",
            "speed",
            90
        ]
    ],
    "type": "line",
    "source": "speeds",
    "id": "90+",
    "paint": {
        "line-color": colors['90+'],
        "line-width": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.5
                ],
                [
                    14,
                    2
                ],
                [
                    18,
                    18
                ]
            ]
        },
        "line-offset": {
            "base": 1.5,
            "stops": [
                [
                    12.5,
                    0.25
                ],
                [
                    14,
                    1
                ],
                [
                    18,
                    9
                ]
            ]
        }
    },
    "source-layer": "speeds"
  },
  {
    "minzoom": 11,
    "layout": {
        "text-size": {
            "base": 1,
            "stops": [
                [
                    10,
                    8
                ],
                [
                    18,
                    11
                ]
            ]
        },
        "text-allow-overlap": true,
        "symbol-avoid-edges": false,
        "text-ignore-placement": true,
        "symbol-spacing": 5,
        "text-font": [
            "DIN Offc Pro Medium",
            "Arial Unicode MS Bold"
        ],
        "symbol-placement": "line",
        "text-justify": "center",
        "text-padding": 1,
        "text-offset": [
            0,
            1
        ],
        "text-rotation-alignment": "map",
        "text-anchor": "center",
        "text-keep-upright": false,
        "text-field": "{speed} km/h ➜"
    },
    "metadata": {},
    "filter": [
        "==",
        "$type",
        "LineString"
    ],
    "type": "symbol",
    "source": "speeds",
    "id": "labels",
    "paint": {
        "text-color": "#fff",
        "text-halo-width": 1,
        "text-halo-color": "#000",
        "text-halo-blur": 0
    },
    "source-layer": "speeds",
    "interactive": true
    },
    // {
    //   "id": "speeds-0", "type": "symbol", "source": "speeds", "source-layer": "turns",
    //   "layout": { "icon-image": "0", "icon-offset": {stops: [[15,[10,0]],[18,[20,0]]]}, "icon-allow-overlap": true, "icon-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] },
    //             "text-field": "{cost}", "text-offset": {"base": 1, stops: [[15,[0.2,0.0]],[18,[3,0]]]}, "text-allow-overlap": true, "text-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] } ,
    //               "text-size": { "base": 1, "stops": [ [ 10, 8 ], [ 18, 11 ] ] }, "text-font": [ "Arial Unicode MS Bold" ], "symbol-avoid-edges": false},
    //   "paint": { "icon-color" : "#ffffff", "icon-halo-color" : "#ffffff", "icon-halo-width" : 2,
    //     "text-color": "hsl(0, 0%, 100%)", "text-halo-width": 1, "text-halo-color": "hsl(0, 0%, 0%)", "text-halo-blur": 0},
    //   "filter": ["all",[">=","turn_angle",-22.5],["<","turn_angle",22.5]]
    // },
    // {
    //   "id": "speeds-45", "type": "symbol", "source": "speeds", "source-layer": "turns",
    //   "layout": { "icon-image": "45", "icon-offset": {stops: [[15,[15,15]],[18,[30,30]]]}, "icon-allow-overlap": true, "icon-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] },
    //             "text-field": "{cost}", "text-offset": {"base": 1, stops: [[15,[0.2,0.2]],[18,[3,3]]]}, "text-allow-overlap": true, "text-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] } ,
    //               "text-size": { "base": 1, "stops": [ [ 10, 8 ], [ 18, 11 ] ] }, "text-font": [ "Arial Unicode MS Bold" ], "symbol-avoid-edges": false},
    //   "paint": { "icon-color" : "#ffffff", "icon-halo-color" : "#ffffff", "icon-halo-width" : 2,
    //     "text-color": "hsl(0, 0%, 100%)", "text-halo-width": 1, "text-halo-color": "hsl(0, 0%, 0%)", "text-halo-blur": 0},
    //   "filter": ["all",[">=","turn_angle",22.5],["<","turn_angle",67.5]]
    // },
    // {
    //   "id": "speeds-90", "type": "symbol", "source": "speeds", "source-layer": "turns",
    //   "layout": { "icon-image": "90", "icon-offset": {stops: [[15,[15,15]],[18,[30,30]]]}, "icon-allow-overlap": true, "icon-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] },
    //             "text-field": "{cost}", "text-offset": {"base": 1, stops: [[15,[0.2,0.2]],[18,[3,3]]]}, "text-allow-overlap": true, "text-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] } ,
    //               "text-size": { "base": 1, "stops": [ [ 10, 8 ], [ 18, 11 ] ] }, "text-font": [ "Arial Unicode MS Bold" ], "symbol-avoid-edges": false},
    //   "paint": { "icon-color" : "#ffffff", "icon-halo-color" : "#ffffff", "icon-halo-width" : 2,
    //     "text-color": "hsl(0, 0%, 100%)", "text-halo-width": 1, "text-halo-color": "hsl(0, 0%, 0%)", "text-halo-blur": 0},
    //   "filter": ["all",[">=","turn_angle",67.5],["<","turn_angle",115.5]]
    // },
    // {
    //   "id": "speeds-135", "type": "symbol", "source": "speeds", "source-layer": "turns",
    //   "layout": { "icon-image": "135", "icon-offset": {stops: [[15,[15,15]],[18,[30,30]]]}, "icon-allow-overlap": true, "icon-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] },
    //             "text-field": "{cost}", "text-offset": {"base": 1, stops: [[15,[0.2,0.2]],[18,[3,3]]]}, "text-allow-overlap": true, "text-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] } ,
    //               "text-size": { "base": 1, "stops": [ [ 10, 8 ], [ 18, 11 ] ] }, "text-font": [ "Arial Unicode MS Bold" ], "symbol-avoid-edges": false},
    //   "paint": { "icon-color" : "#ffffff", "icon-halo-color" : "#ffffff", "icon-halo-width" : 2,
    //     "text-color": "hsl(0, 0%, 100%)", "text-halo-width": 1, "text-halo-color": "hsl(0, 0%, 0%)", "text-halo-blur": 0},
    //   "filter": ["all",[">=","turn_angle",115.5],["<=","turn_angle",180]]
    // },
    // {
    //   "id": "speeds-n45", "type": "symbol", "source": "speeds", "source-layer": "turns",
    //   "layout": { "icon-image": "n45", "icon-offset": {stops: [[15,[15,30]],[18,[30,60]]]}, "icon-allow-overlap": true, "icon-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] },
    //             "text-field": "{cost}", "text-offset": {"base": 1, stops: [[15,[0.15,0.4]],[18,[2.5,6]]]}, "text-allow-overlap": true, "text-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] } ,
    //               "text-size": { "base": 1, "stops": [ [ 10, 8 ], [ 18, 11 ] ] }, "text-font": [ "Arial Unicode MS Bold" ], "symbol-avoid-edges": false},
    //   "paint": { "icon-color" : "#ffffff", "icon-halo-color" : "#ffffff", "icon-halo-width" : 2,
    //     "text-color": "hsl(0, 0%, 100%)", "text-halo-width": 1, "text-halo-color": "hsl(0, 0%, 0%)", "text-halo-blur": 0},
    //   "filter": ["all",[">=","turn_angle",-67.5],["<","turn_angle",-22.5]]
    // },
    // {
    //   "id": "speeds-n90", "type": "symbol", "source": "speeds", "source-layer": "turns",
    //   "layout": { "icon-image": "n90", "icon-offset": {stops: [[15,[15,30]],[18,[30,60]]]}, "icon-allow-overlap": true, "icon-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] },
    //             "text-field": "{cost}", "text-offset": {"base": 1, stops: [[15,[0.15,0.4]],[18,[2.5,6]]]}, "text-allow-overlap": true, "text-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] } ,
    //               "text-size": { "base": 1, "stops": [ [ 10, 8 ], [ 18, 11 ] ] }, "text-font": [ "Arial Unicode MS Bold" ], "symbol-avoid-edges": false},
    //   "paint": { "icon-color" : "#ffffff", "icon-halo-color" : "#ffffff", "icon-halo-width" : 2,
    //     "text-color": "hsl(0, 0%, 100%)", "text-halo-width": 1, "text-halo-color": "hsl(0, 0%, 0%)", "text-halo-blur": 0},
    //   "filter": ["all",["<=","turn_angle",-67.5],[">","turn_angle",-115.5]]
    // },
    // {
    //   "id": "speeds-n135", "type": "symbol", "source": "speeds", "source-layer": "turns",
    //   "layout": { "icon-image": "n135", "icon-offset": {stops: [[15,[15,30]],[18,[30,60]]]}, "icon-allow-overlap": true, "icon-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] },
    //             "text-field": "{cost}", "text-offset": {"base": 1, stops: [[15,[0.15,0.4]],[18,[2.5,6]]]}, "text-allow-overlap": true, "text-rotate": { property: "bearing_in", stops: [[0, 0], [360, 360]] } ,
    //               "text-size": { "base": 1, "stops": [ [ 10, 8 ], [ 18, 11 ] ] }, "text-font": [ "Arial Unicode MS Bold" ], "symbol-avoid-edges": false},
    //   "paint": { "icon-color" : "#ffffff", "icon-halo-color" : "#ffffff", "icon-halo-width" : 2,
    //     "text-color": "hsl(0, 0%, 100%)", "text-halo-width": 1, "text-halo-color": "hsl(0, 0%, 0%)", "text-halo-blur": 0},
    //   "filter": ["all",[">=","turn_angle",-180],["<","turn_angle",-115.5]]
    // }
  ]
