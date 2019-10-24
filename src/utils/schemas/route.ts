const ReturnCode = {
  id: '/ReturnCode',
  description: 'aed',
  type: 'string',
  enum: [
    'Ok',
    'RequestViolatesConstraints',
    'SnappingFailed',
    'NoRoute',
    'NoMatch',
    'NoMatrix',
    'NoTile',
    'NoNearest',
    'GeneralError'
  ]
}

const SnappedLocation = {
  id: '/SnappedLocation',
  description: 'Location snapped to street network',
  type: 'object',
  required: ['snapDistance', 'location'],
  properties: {
    snapDistance: {
      description:
        'Distance in meters the location has been moved in order to snap to a road.',
      type: 'number',
      format: 'float'
    },
    location: {
      $ref: '/Location'
    }
  }
}

const RouteLeg = {
  id: '/RouteLeg',
  description: 'Leg of a route specifying the geometry and nodes the leg consist of',
  type: 'object',
  required: ['duration', 'distance'],
  properties: {
    duration: {
      description: 'Duration for the leg in seconds',
      type: 'number',
      format: 'float',
      minimum: 0
    },
    distance: {
      description: 'Distance for the leg in meters',
      type: 'number',
      format: 'float',
      minimum: 0
    },
    nodes: {
      description: 'Array of nodes this leg consists of.',
      type: 'array',
      items: {
        type: 'number',
        format: 'uint64'
      }
    },
    geometry: {
      description: 'Linestring describing the geometry of this leg',
      type: 'array',
      items: {
        $ref: '/Location'
      }
    }
  }
}

const Location = {
  id: '/Location',
  description: 'Geographic location on planet Earth (lon, lat) tuples',
  type: 'object',
  required: ['lon', 'lat'],
  properties: {
    lon: {
      description: 'longitude',
      example: 13.3866906,
      type: 'number',
      format: 'double'
    },
    lat: {
      description: 'latitude',
      example: 52.5145233,
      type: 'number',
      format: 'double'
    }
  }
}

const InputLocation = {
  id: '/InputLocation',
  description: 'Input location contains additional contraint data for snapping input',
  allOf: [
    {
      $ref: '/Location'
    },
    {
      type: 'object',
      properties: {
        radius: {
          description: 'Limits the search of route to given radius in meters.',
          example: 300,
          type: 'number',
          format: 'float',
          minimum: 0
        },
        bearing: {
          $ref: '/Bearing'
        }
      }
    }
  ]
}

const Bearing = {
  id: '/Bearing',
  description: 'Forces the route to start/arrive at a location with a specified bearing',
  type: 'object',
  required: ['degree', 'range'],
  properties: {
    degree: {
      description: 'Input bearing in degrees towards true north in clockwise direction',
      type: 'number',
      example: 90,
      format: 'int32',
      maximum: 360,
      minimum: 0,
      default: 0
    },
    range: {
      description:
        'Range values for provided input bearing in which to search. E.g. a bearing of `90` with a range of `10` checks for roads in the direction between `80-100`.',
      example: 45,
      type: 'number',
      format: 'int32',
      maximum: 180,
      minimum: 0,
      default: 180
    }
  }
}

const Route = {
  ReturnCode,
  Bearing,
  Location,
  InputLocation,
  RouteLeg,
  SnappedLocation,
  Body: {
    id: '/RouteRequest',
    description: 'Point-to-point routing parameters',
    type: 'object',
    required: ['locations'],
    properties: {
      locations: {
        description: 'Waypoints along the route',
        type: 'array',
        items: {
          $ref: '/InputLocation'
        },
        minItems: 2
      },
      reportGeometry: {
        description: 'Response should contain the route geometry',
        type: 'boolean',
        default: false
      },
      reportNodes: {
        description:
          'Optional attribute for requesting basemap node IDs, if this flag set to true IDs would be part of response',
        type: 'boolean',
        default: false
      }
    }
  },
  Response: {
    id: '/RouteResponse',
    description: 'Point-to-point routing response',
    type: 'object',
    required: ['code', 'routes', 'locations'],
    properties: {
      code: {
        $ref: '/ReturnCode'
      },
      routes: {
        description: 'Point-to-point routes',
        minItems: 1,
        type: 'array',
        items: {
          $ref: '/Route'
        }
      },
      locations: {
        description: 'Route waypoints',
        minItems: 2,
        type: 'array',
        items: {
          $ref: '/SnappedLocation'
        }
      }
    }
  },
  Route: {
    id: '/Route',
    description: 'Point-to-point route',
    type: 'object',
    required: ['totalDuration', 'totalDistance'],
    properties: {
      totalDuration: {
        description:
          'Duration for the entire route (sum of all leg durations) in seconds',
        type: 'number',
        format: 'float',
        minimum: 0
      },
      totalDistance: {
        description:
          'Distance for the entire route (sum all of all leg distances) in meters',
        type: 'number',
        format: 'float',
        minimum: 0
      },
      legs: {
        description: 'Array of legs this route consists of.',
        type: 'array',
        minItems: 1,
        items: {
          $ref: '/RouteLeg'
        }
      }
    }
  }
}

export default Route as any
