const ReturnCode = {
	"id": "/ReturnCode",
  "description": "aed",
  "type": "string",
  "enum": [
    "Ok",
    "RequestViolatesConstraints",
    "SnappingFailed",
    "NoRoute",
    "NoMatch",
    "NoMatrix",
    "NoTile",
    "NoNearest",
    "GeneralError"
  ]
}

const SnappedLocation = {
  "id": "/SnappedLocation",
  "description": "Location snapped to street network",
  "type": "object",
  "required": ["snapDistance", "location"],
  "properties": {
    "snapDistance": {
      "description": "Distance in meters the location has been moved in order to snap to a road.",
      "type": "number",
      "format": "float"
    },
    "location": {
      "$ref": "/Location"
    }
  }
}

const RouteLeg = {
  "id": "/RouteLeg",
  "description": "Leg of a route specifying the geometry and nodes the leg consist of",
  "type": "object",
  "required": [
    "duration",
    "distance"
  ],
  "properties": {
    "duration": {
      "description": "Duration for the leg in seconds",
      "type": "number",
      "format": "float",
      "minimum": 0
    },
    "distance": {
      "description": "Distance for the leg in meters",
      "type": "number",
      "format": "float",
      "minimum": 0
    },
    "nodes": {
      "description": "Array of nodes this leg consists of.",
      "type": "array",
      "items": {
        "type": "number",
        "format": "uint64"
      }
    },
    "geometry": {
      "description": "Linestring describing the geometry of this leg",
      "type": "array",
      "items": {
        "$ref": "/Location"
      }
    }
  }
}

const Location = {
  "id": "/Location",
  "description": "Geographic location on planet Earth (lon, lat) tuples",
  "type": "object",
  "required": [
    "lon",
    "lat"
  ],
  "properties": {
    "lon": {
      "description": "longitude",
      "example": 13.3866906,
      "type": "number",
      "format": "double"
    },
    "lat": {
      "description": "latitude",
      "example": 52.5145233,
      "type": "number",
      "format": "double"
    }
  }
}

const InputLocation = {
	"id": "/InputLocation",
	"description": "Input location contains additional contraint data for snapping input",
	"allOf": [
		{
			"$ref": "/Location"
		},
		{
			"type": "object",
			"properties": {
				"radius": {
					"description": "Limits the search of route to given radius in meters.",
					"example": 300,
					"type": "number",
					"format": "float",
					"minimum": 0
				},
				"bearing": {
					"$ref": "/Bearing"
				}
			}
		}
	]
}

const Bearing = {
	"id": "/Bearing",
	"description": "Forces the route to start/arrive at a location with a specified bearing",
	"type": "object",
	"required": [
		"degree",
		"range"
	],
	"properties": {
    "degree": {
      "description": "Input bearing in degrees towards true north in clockwise direction",
      "type": "number",
      "example": 90,
      "format": "int32",
      "maximum": 360,
      "minimum": 0,
      "default": 0
    },
    "range": {
      "description": "Range values for provided input bearing in which to search. E.g. a bearing of `90` with a range of `10` checks for roads in the direction between `80-100`.",
      "example": 45,
      "type": "number",
      "format": "int32",
      "maximum": 180,
      "minimum": 0,
      "default": 180
    }
  }
}


export const Match = {
  Body: {
    "id": "/MatchRequest",
    "description": "Map-Matching parameters",
    "type": "object",
    "required": [
      "locations"
    ],
    "properties": {
      "locations": {
        "description": "Waypoints to map-match",
        "type": "array",
        "items": {
          "$ref": "/InputLocation"
        },
        "minItems": 2,
        "example": [
          {
            "lon": 13.166797,
            "lat": 52.550957,
            "radius": 300,
            "bearing": {
              "degree": 0,
              "range": 180
            }
          },
          {
            "lon": 13.1666851,
            "lat": 52.55097,
            "radius": 300,
            "bearing": {
              "degree": 0,
              "range": 180
            }
          }
        ]
      },
      "timestamps": {
        "description": "Timestamps corresponding to waypoints in seconds since UNIX epoch. Must be monotonically increasing.",
        "type": "array",
        "items": {
          "type": "number",
          "format": "int64",
          "minimum": 0,
          "example": 1556208568
        },
        "example": [
          1556208268,
          1556208568
        ]
      },
      "reportNodes": {
        "description": "Optional attribute for requesting basemap node IDs, if this flag set to true IDs would be part of response",
        "type": "boolean",
        "default": false,
        "example": false
      },
      "reportGeometry": {
        "description": "Optional attribute for requesting geometry information.",
        "type": "boolean",
        "default": false,
        "example": false
      }
    }
  },
  Response: {
    "id": "MatchResponse",
    "description": "Map-matching response",
    "type": "object",
    "required": [
      "code",
      "matchings",
      "tracepoints"
    ],
    "properties": {
      "code": {
        "$ref": "/ReturnCode"
      },
      "matchings": {
        "description": "An array of matching objects that assemble the trace",
        "type": "array",
        "items": {
          "$ref": "/Matching"
        },
        "minItems": 0
      },
      "tracepoints": {
        "description": "Array of tracepoints matched to the routing map",
        "type": "array",
        "items": {
          "$ref": "/SnappedLocation"
        }
      }
    }
  },
  Matching: {
    "id": "/Matching",
    "description": "A matching object holds the tracepoints and legs of a map-matching response",
    "type": "object",
    "required": [
      "confidence",
      "legs"
    ],
    "properties": {
      "confidence": {
        "description": "Confidence of this matching (1 = completely confident)",
        "type": "number",
        "format": "float",
        "minimum": 0,
        "maximum": 1
      },
      "legs": {
        "description": "Array of legs for this matching.",
        "type": "array",
        "items": {
          "type": "object",
          "description": "Each entry is associated to the leg between 2 tracepoints",
          "allOf": [
            {
              "$ref": "/RouteLeg"
            },
            {
              "type": "object",
              "properties": {
                "traceFromIndex": {
                  "description": "Start point of the leg",
                  "type": "number",
                  "format": "int32"
                },
                "traceToIndex": {
                  "description": "End point of the leg",
                  "type": "number",
                  "format": "int32"
                }
              }
            }
          ]
        }
      }
    }
  },
  RouteLeg,
  Location,
  SnappedLocation,
  ReturnCode,
  InputLocation,
  Bearing
}

export default Match as any

