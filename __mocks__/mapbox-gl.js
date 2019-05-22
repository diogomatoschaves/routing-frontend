

// export default mapboxgl = jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
//   GeolocateControl: jest.fn(),
//   Map: jest.fn(() => ({
//     addControl: jest.fn(),
//     on: jest.fn(),
//     remove: jest.fn()
//   })),
//   NavigationControl: jest.fn(),
//   Point: jest.fn(),
//   Marker: jest.fn(() => ({
//     setLngLat: jest.fn(),
//     addTo: jest.fn(),
//     remove: jest.fn()
//   }))
// }));

const mapboxgl = jest.genMockFromModule('mapbox-gl/dist/mapbox-gl');

class Map {
  addControl = () => jest.fn()
  on = () => jest.fn()
  remove = () => jest.fn()
  fitBounds = () => jest.fn()
}

class Marker {
  setLngLat = jest.fn().mockImplementation(() => ({
    addTo: jest.fn()
  }))
  // setLngLat = setLngLat
  addTo = () => jest.fn()
  remove = () => jest.fn()
  getLngLat = () => jest.fn()
}

class LngLatBounds {
  extend = () => jest.fn()
}

const GeolocateControl = jest.fn()
const NavigationControl = jest.fn()
const Point = jest.fn()

mapboxgl.Map = Map
mapboxgl.Marker = Marker
mapboxgl.GeolocateControl = GeolocateControl
mapboxgl.NavigationControl = NavigationControl
mapboxgl.Point = Point
mapboxgl.LngLatBounds = LngLatBounds

export default mapboxgl;