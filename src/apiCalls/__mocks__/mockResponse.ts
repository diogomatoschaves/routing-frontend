const mockServerResponse = {
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
    { snapDistance: 0.45025736761464097, location: { lon: 13.389869, lat: 52.510348 } },
    { snapDistance: 12.073291914193243, location: { lon: 13.39114, lat: 52.510425 } }
  ]
}

export default mockServerResponse
