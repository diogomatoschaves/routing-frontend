export const mockCarResponse = {
  code: 'Ok',
  routes: [
    {
      totalDistance: 86.5,
      totalDuration: 15.1,
      legs: [
        {
          duration: 15.1,
          distance: 86.5,
          geometry: [
            { lon: 13.389869, lat: 52.510348 },
            { lon: 13.389899, lat: 52.51035 },
            { lon: 13.390113, lat: 52.510363 },
            { lon: 13.390178, lat: 52.510367 },
            { lon: 13.390305, lat: 52.510375 },
            { lon: 13.390589, lat: 52.510393 },
            { lon: 13.390867, lat: 52.510409 },
            { lon: 13.39114, lat: 52.510425 },
            { lon: 13.39114, lat: 52.510425 },
            { lon: 13.39114, lat: 52.510425 }
          ]
        }
      ]
    }
  ],
  locations: [
    {
      snapDistance: 0.45025736761464097,
      location: {
        lon: 13.389869,
        lat: 52.510348
      }
    },
    {
      snapDistance: 12.073291914193243,
      location: {
        lon: 13.39114,
        lat: 52.510425
      }
    }
  ]
}

export const mockCarTrafficResponse = {
  code: 'Ok',
  routes: [
    {
      totalDistance: 86.5,
      totalDuration: 12.6,
      legs: [
        {
          duration: 12.6,
          distance: 86.5,
          geometry: [
            { lon: 13.389869, lat: 52.510348 },
            { lon: 13.389899, lat: 52.51035 },
            { lon: 13.390113, lat: 52.510363 },
            { lon: 13.390178, lat: 52.510367 },
            { lon: 13.390305, lat: 52.510375 },
            { lon: 13.390589, lat: 52.510393 },
            { lon: 13.390867, lat: 52.510409 },
            { lon: 13.39114, lat: 52.510425 },
            { lon: 13.39114, lat: 52.510425 },
            { lon: 13.39114, lat: 52.510425 }
          ]
        }
      ]
    }
  ],
  locations: [
    {
      snapDistance: 0,
      location: {
        lon: 13.389869,
        lat: 52.510348
      }
    },
    {
      snapDistance: 0,
      location: {
        lon: 13.39114,
        lat: 52.510425
      }
    }
  ]
}

export const mockFootResponse = {
  code: 'Ok',
  routes: [
    {
      totalDistance: 709.8,
      totalDuration: 514.9,
      legs: [
        {
          duration: 514.9,
          distance: 709.8,
          geometry: [
            { lon: 13.387123, lat: 52.527155 },
            { lon: 13.387215, lat: 52.527166 },
            { lon: 13.387215, lat: 52.527166 },
            { lon: 13.387189, lat: 52.52703 },
            { lon: 13.387184, lat: 52.527008 },
            { lon: 13.387283, lat: 52.526386 },
            { lon: 13.387283, lat: 52.526386 },
            { lon: 13.387743, lat: 52.526289 },
            { lon: 13.387824, lat: 52.526272 },
            { lon: 13.388361, lat: 52.526146 },
            { lon: 13.388507, lat: 52.526111 },
            { lon: 13.388802, lat: 52.526039 },
            { lon: 13.388987, lat: 52.525933 },
            { lon: 13.389304, lat: 52.525859 },
            { lon: 13.389668, lat: 52.525767 },
            { lon: 13.389995, lat: 52.525692 },
            { lon: 13.389995, lat: 52.525692 },
            { lon: 13.390095, lat: 52.525772 },
            { lon: 13.390474, lat: 52.525863 },
            { lon: 13.393425, lat: 52.526381 },
            { lon: 13.393541, lat: 52.526401 },
            { lon: 13.393625, lat: 52.526417 },
            { lon: 13.393977, lat: 52.526485 },
            { lon: 13.395811, lat: 52.526839 },
            { lon: 13.395811, lat: 52.526839 },
            { lon: 13.395811, lat: 52.526839 }
          ]
        }
      ]
    }
  ],
  locations: [
    { snapDistance: 4.3196444235727816, location: { lon: 13.387123, lat: 52.527155 } },
    { snapDistance: 1.0574398354756074, location: { lon: 13.395811, lat: 52.526839 } }
  ]
}

export const mockMatchResponse = {
  code: 'Ok',
  matchings: [
    {
      confidence: 0.0000758067430938203,
      legs: [
        {
          traceFromIndex: 0,
          traceToIndex: 1,
          duration: 15.7,
          distance: 61.4,
          nodes: [3702215766, 4988889182, 3284701967, 3284701968, 4988889210, 1899166276],
          geometry: [
            {
              lon: -121.939153,
              lat: 37.323071
            },
            {
              lon: -121.939153,
              lat: 37.32308
            },
            {
              lon: -121.939186,
              lat: 37.323185
            },
            {
              lon: -121.939216,
              lat: 37.323323
            },
            {
              lon: -121.939371,
              lat: 37.323309
            },
            {
              lon: -121.939584,
              lat: 37.323291
            }
          ]
        }
      ]
    }
  ],
  tracepoints: [
    {
      snapDistance: 0.2659007253251622,
      location: {
        lon: -121.939153,
        lat: 37.323071
      }
    },
    {
      snapDistance: 4.240507147325359,
      location: {
        lon: -121.939584,
        lat: 37.323291
      }
    }
  ]
}
