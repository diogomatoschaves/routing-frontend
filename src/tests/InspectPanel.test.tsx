import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { mockCarResponse } from '../apiCalls/__mocks__/mockResponse'
import InspectPanel from '../components/InspectPanel'

const mockLocations = [
  {
    lat: null,
    lon: null,
    marker: 'map marker alternate',
    name: 'start',
    placeholder: 'Origin'
  },
  {
    lat: null,
    lon: null,
    marker: 'flag checkered',
    name: 'end',
    placeholder: 'Destination'
  }
]

const mockEventStart = { lon: 13.389869, lat: 52.510348 }
const mockEventEnd = { lon: 13.39114, lat: 52.510425 }

const mockBody = {
  locations: [
    {
      lat: mockEventStart.lat,
      lon: mockEventStart.lon
    },
    {
      lat: mockEventEnd.lat,
      lon: mockEventEnd.lon
    }
  ],
  reportGeometry: true
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
  activeIdx: 0,
  options: [
    {
      key: 'develop',
      text: 'https://routing.develop.otonomousmobility.com/${PROFILE}',
      value: 0
    },
    {
      key: 'staging',
      text: 'https://routing.staging.otonomousmobility.com/${PROFILE}',
      value: 1
    },
    {
      key: 'testing',
      text: 'https://routing.testing.otonomousmobility.com/${PROFILE}',
      value: 2
    },
    { key: 'localhost', text: 'http://localhost:5000', value: 3 }
  ]
}

const mockAddDataTabsHandler = {
  activeIdx: 0,
  options: [
    { key: 'routingResponse', text: 'Routing Service', value: 0 },
    { key: 's3', text: 'Import from S3', value: 1 }
  ]
}

const mockModeTabsHandler = {
  activeIdx: 0,
  options: [
    { key: 'default', text: 'Interactive', value: 0 },
    { key: 'debug', text: 'Debugging', value: 1 }
  ]
}

const mockResponseOptionsHandler = {
  activeIdx: 0,
  options: [
    { key: 'routeResponse', text: 'No Traffic', value: 0 },
    { key: 'trafficResponse', text: 'w/ Traffic', value: 1 },
    { key: 'googleResponse', text: 'Google', value: 2 }
  ]
}

const inputValues = {
  body: '',
  match: '',
  response: '',
  route: ''
}

const inputColors = {
  body: 'rgb(100, 100, 100)',
  match: 'rgb(100, 100, 100)',
  route: 'rgb(100, 100, 100)'
}

it('expect to render InspectPanel component', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={['/']}>
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
        responseOption={
          mockResponseOptionsHandler.options[mockResponseOptionsHandler.activeIdx]
        }
        locations={mockLocations}
        selectedService={0}
        serviceOptions={serviceOptions}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
})
