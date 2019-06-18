import React from 'react'
import TestRenderer from 'react-test-renderer'
import mockRoute from '../apiCalls/__mocks__/mockRoute'
// import 'jest-dom/extend-expect'
import App from '../components/App'
import Map from '../components/Map'
import ControlledInput from '../components/ControlledInput'
import { formatCoords } from '../utils/functions'


jest.mock('../apiCalls');

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
});

const mockEventStart = {
  lngLat: {
    lat: 53,
    lng: 12
  }
}

const mockEventEnd = {
  lngLat: {
    lat: 55,
    lng: 15
  }
}


describe('Start and end points work as expected', () => {

  describe('When user clicks on map', () => {

    const testInstance = TestRenderer.create(<App />)
    const root = testInstance.root

    const MapComponent = root.findByType(Map).instance
    const InputComponent = root.findAllByType(ControlledInput)

    MapComponent.handleMapClick(mockEventStart)
    // console.log(MapComponent)
    
    it('updates locations object with coordinates', () => {

      const { locations } = MapComponent.props

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')

      expect(startPoint.lat).toBe(mockEventStart.lngLat.lat);
      expect(startPoint.lng).toBe(mockEventStart.lngLat.lng);

      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(null);
      expect(endPoint.lng).toBe(null);

    })

    it('updates start input\'s value', () => {
      const { value: valueStartInput } = InputComponent[0].instance.state

      expect(valueStartInput).toBe(formatCoords(mockEventStart.lngLat))
    })

    it('inserts a marker on the map', () => {
      const { markers } = MapComponent.state

      expect(markers.length).toBe(1)
    })
  })

  describe('When user clicks twice on map', () => {

    const testInstance = TestRenderer.create(<App />)
    const root = testInstance.root

    const MapComponent = root.findByType(Map).instance
    const InputComponent = root.findAllByType(ControlledInput)

    MapComponent.handleMapClick(mockEventStart)
    MapComponent.handleMapClick(mockEventEnd)
    
    it('updates locations object with coordinates ', () => {

      const { locations } = MapComponent.props

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')
      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(startPoint.lat).toBe(mockEventStart.lngLat.lat);
      expect(startPoint.lng).toBe(mockEventStart.lngLat.lng);
      expect(endPoint.lat).toBe(mockEventEnd.lngLat.lat);
      expect(endPoint.lng).toBe(mockEventEnd.lngLat.lng);
    })

    it('updates start and end inputs\' value', () => {
      const { value: valueStartInput } = InputComponent[0].instance.state
      const { value: valueEndInput } = InputComponent[1].instance.state

      expect(valueStartInput).toBe(formatCoords(mockEventStart.lngLat))
      expect(valueEndInput).toBe(formatCoords(mockEventEnd.lngLat))
    })

    it('inserts a marker on the map', () => {
      const { markers } = MapComponent.state
      expect(markers.length).toBe(2)
    })

    it('correctly fetches a route and it is shown to the user', (done) => {
      
      delay(500)
      .then(() => {
        const { routePath } = MapComponent.props
        expect(routePath).toEqual(mockRoute)
        done()
      })
    })
  })
})


