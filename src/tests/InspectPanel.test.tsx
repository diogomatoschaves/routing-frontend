import React from 'react'
import TestRenderer from 'react-test-renderer'
import InspectPanel from '../components/InspectPanel'
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

const mockAddDataTabsHandler = {
  options: [
    { key: 'routingResponse', text: 'Routing Service', value: 0 },
    { key: 's3', text: 'Import from S3', value: 1 }
  ],
  activeIdx: 0
}

const mockModeTabsHandler = {
  options: [
    { key: 'default', text: 'Interactive', value: 0 },
    { key: 'debug', text: 'Debugging', value: 1 }
  ],
  activeIdx: 0
}

const mockResponseOptionsHandler = {
  options: [
    { key: 'routeResponse', text: 'No Traffic', value: 0 },
    { key: 'trafficResponse', text: 'w/ Traffic', value: 1 },
    { key: 'googleResponse', text: 'Google', value: 2 }
  ],
  activeIdx: 0
}

const inputValues = {
  route: '',
  match: '',
  body: '',
  response: ''
}


const inputColors = {
  route: 'rgb(100, 100, 100)',
  match:  'rgb(100, 100, 100)',
  body: 'rgb(100, 100, 100)'
}

it('expect to render InspectPanel component', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <InspectPanel
        inputValues={inputValues}
        inputColors={inputColors}
        responseEdit={false}
        bodyEdit={false}
        debug={false}
        addedRoutes={[]}
        addDataTabsHandler={mockAddDataTabsHandler}
        modeTabsHandler={mockModeTabsHandler}
        handleHideClick={jest.fn()}
        handleAddRoute={jest.fn()}
        handleChangeBody={jest.fn()}
        handleCloseModal={jest.fn()}
        handleValueUpdate={jest.fn()}
        handleDeleteRoute={jest.fn()}
        handleClickRoute={jest.fn()}
        response={mockCarResponse}
        body={mockBody}
        endpointHandler={mockEndpointHandler}
        updatePoint={jest.fn()}
        updateState={jest.fn()}
        responseOptionsHandler={mockResponseOptionsHandler}
        responseOption={mockResponseOptionsHandler.options[mockResponseOptionsHandler.activeIdx]}
        locations={mockLocations}
        selectedService={0}
        serviceOptions={serviceOptions}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
})
