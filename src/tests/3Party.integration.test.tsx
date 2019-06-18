import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Checkbox, Input } from 'semantic-ui-react'
import App from '../components/App'
import Map from '../components/Map'
import mockRoute from '../apiCalls/__mocks__/mockRoute'
import mockGoogleResponse from '../apiCalls/__mocks__/mockGoogleResponse'


jest.mock('../apiCalls')

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

describe('When 3rd party option is selected', () => {

  const testInstance = TestRenderer.create(<App windowProp={true}/>)
  const root = testInstance.root

  const togglerProps = {
    text: 'Compare 3rd Party',
    id: 'googleMapsOption'
  }

  const Toggler = root.findAllByType(Checkbox).filter((el) => {
    return el.props.id === togglerProps.id
  })[0]

  Toggler.props.onChange('', { checked: true })

  describe('When 2 valid values are inserted on input boxes', () => {

    const input = root.findAllByType(Input);

    input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
    input[0].props.onBlur()
    input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
    input[1].props.onBlur()

    const MapComponent = root.findByType(Map).instance
    
    it('correctly fetches both a routing-service and google route, and the Map component receives it', (done) => {
      delay(500)
      .then(() => {
        const { googleRoute, routePath } = MapComponent.props

        expect(googleRoute).toEqual(mockGoogleResponse)
        expect(routePath).toEqual(mockRoute)
        done()
      })
    })
  })
})