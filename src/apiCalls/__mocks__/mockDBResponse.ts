const mockDBRoute = { 
  "id": "1234qwer", 
  "eta": 123, 
  "provider": {
    "name" : "Das",
    "type" : "routing",
    "url": "routing.das.car",
  },
  "source": {
    "name" : "Das1",
  },

  "waypoints": {
    "origin": [ 1.5, 0.11 ],
    "destination": [ 34.5, -112.11 ],
    "middlePoints" : [ [-34.15, -112.12] ]
  },
  "geometry": {
    "type": "LineString", 
    "coordinates": [ 
      [ 34.5, 12.11 ],
      [ -34.5, -12.11 ],
      [ 34.5, 112.11 ],
      [ 34.5, -12.11 ] 
  ]},
  "ata": 345,
  "confidence": 3,
  "date": "How I can check this" 
}


export const mockValidDBResponse = {
  exists: true,
  routes: [mockDBRoute]
}

export const mockInvalidDBResponse = {
  exists: false,
  routes: []
}

