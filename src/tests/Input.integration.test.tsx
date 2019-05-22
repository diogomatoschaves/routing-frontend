import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Input } from 'semantic-ui-react'
// import 'jest-dom/extend-expect'
import App from '../components/App'
import Map from '../components/Map'


const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

  const mockCoords = {
    lat: 53,
    lng: 12
  }

describe('Start point Input works as expected on blur', () => {

  const testInstance = TestRenderer.create(<App />)
  const root = testInstance.root
  const input = root.findAllByType(Input);

  describe('When an invalid value is inserted', async () => {

    beforeEach(async() => {
      input[0].props.onChange('', { value: 'test' })
      input[0].props.onBlur()

      await delay(500)
    })
    
    it('does not update the locations array', () => {

      const MapComponent = root.findByType(Map);

      const { locations } = MapComponent.instance.props

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')

      expect(startPoint.lat).toBe(null);
      expect(startPoint.lng).toBe(null);
    })

    it('does not insert a marker on the Map component', () => {

      const MapComponent = root.findByType(Map);

      const { markers } = MapComponent.instance.state

      expect(markers.length).toBe(0)
    })

  })

  describe('When a valid value is inserted', async () => {

    beforeEach(async() => {
      input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
      input[0].props.onBlur()

      await delay(500)
    })
    
    it('does update the locations array with the corresponding change', () => {

      const MapComponent = root.findByType(Map);

      const { locations } = MapComponent.instance.props

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')

      expect(startPoint.lat).toBe(mockCoords.lat);
      expect(startPoint.lng).toBe(mockCoords.lng);
    })

    it('inserts a marker on the Map component', () => {

      const MapComponent = root.findByType(Map);

      const { markers } = MapComponent.instance.state

      expect(markers.length).toBe(1)
    })

  })
})

describe('End point Input works as expected on blur', () => {

  describe('When an invalid value is inserted', async () => {

    const testInstance = TestRenderer.create(<App />)
    const root = testInstance.root
    const input = root.findAllByType(Input);

    beforeEach(async() => {
      input[1].props.onChange('', { value: 'test' })
      input[1].props.onBlur()

      await delay(500)
    })
    
    it('does not update the locations array', () => {

      const MapComponent = root.findByType(Map);

      const { locations } = MapComponent.instance.props

      expect(locations.length).toBe(2);

      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(null);
      expect(endPoint.lng).toBe(null);
    })

    it('does not insert a marker on the Map component', () => {

      const MapComponent = root.findByType(Map);

      const { markers } = MapComponent.instance.state

      expect(markers.length).toBe(0)
    })

  })

  describe('When a valid value is inserted', async () => {

    const testInstance = TestRenderer.create(<App />)
    const root = testInstance.root
    const input = root.findAllByType(Input);

    beforeEach(async() => {

      input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
      input[1].props.onBlur()

      await delay(500)

    })
    
    it('does update the locations array with the corresponding value', () => {

      const MapComponent = root.findByType(Map);

      const { locations } = MapComponent.instance.props

      expect(locations.length).toBe(2);

      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(mockCoords.lat);
      expect(endPoint.lng).toBe(mockCoords.lng);
    })

    test('inserts a marker on the Map component', () => {

      const MapComponent = root.findByType(Map);

      const { markers } = MapComponent.instance.state

      expect(markers.length).toBe(1)
    })
  })
})

