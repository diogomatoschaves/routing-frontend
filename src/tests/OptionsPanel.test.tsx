import React from 'react'
import TestRenderer from 'react-test-renderer'
import OptionsPanel from '../components/OptionsPanel'
import { MemoryRouter } from 'react-router-dom'
import { mockCarResponse } from '../apiCalls/__mocks__/mockResponse'



const mockLocations = [{
  name: 'start',
  marker: 'map marker alternate',
  placeholder: 'Origin',
  lat: null,
  lng: null
}, {
  name: 'end',
  marker: 'flag checkered',
  placeholder: 'Destination',
  lat: null,
  lng: null
}]

const mockEventStart = { lng: 13.389869, lat: 52.510348 }
const mockEventEnd = { lng: 13.39114, lat: 52.510425 }

const mockBody = {
  locations: [
    {
      lat: mockEventStart.lat,
      lon: mockEventStart.lng
    },
    {
      lat: mockEventEnd.lat,
      lon: mockEventEnd.lng
    },
  ],
  reportGeometry: true,
}

const serviceOptions = [
  {
    key: 'Route',
    text: 'Route',
    value: 0
  },
  {
    key: 'Match',
    text: 'Match',
    value: 1
  }
]

const mockEndpointHandler = {
  options: [
    { key: 'develop', text: 'https://routing.develop.otonomousmobility.com/${PROFILE}', value: 0 },
    { key: 'staging', text: 'https://routing.staging.otonomousmobility.com/${PROFILE}', value: 1 },
    { key: 'testing', text: 'https://routing.testing.otonomousmobility.com/${PROFILE}', value: 2 },
    { key: 'localhost', text: 'http://localhost:5000', value: 3 },
  ],
  activeIdx: 0
}

it('expect to render OptionsPanel component', () => {

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <OptionsPanel
        handleHideClick={jest.fn()}
        response={mockCarResponse}
        body={mockBody}
        endpointHandler={mockEndpointHandler}
        updatePoint={jest.fn()}
        updateState={jest.fn()}
        responseOption={'normal'}
        locations={mockLocations}
        selectedService={0}
        serviceOptions={serviceOptions}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
})
