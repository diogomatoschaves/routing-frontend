import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import Map from '../components/Map'

const mockGeographies = [
  {
    coords: [13.38408, 52.51721],
    name: 'Berlin',
    polygon: 'berlin.geojson'
  },
  {
    coords: [9.033, 48.7111],
    name: 'Stuttgart',
    polygon: 'stuttgart.geojson'
  },
  {
    coords: [8.7214, 47.912],
    name: 'Immendingen',
    polygon: 'immendingen.geojson'
  },
  {
    coords: [-121.97588, 37.34606],
    name: 'San José',
    polygon: 'sunnyvale.geojson'
  }
]

const mockLocations = [
  {
    lat: null,
    lng: null,
    marker: 'map marker alternate',
    name: 'start',
    placeholder: 'Origin'
  },
  {
    lat: null,
    lng: null,
    marker: 'flag checkered',
    name: 'end',
    placeholder: 'Destination'
  }
]

const mockRoutePath = [
  { lat: 52.5184035, lon: 13.3818403 },
  { lat: 52.5108246, lon: 13.3953626 }
]

const mockRoute = {
  distance: 100,
  duration: 60,
  routePath: mockRoutePath
}

it('expect to render Panel comoponent', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={['/']}>
      <Map
        locations={mockLocations}
        updatePoint={jest.fn()}
        updateState={jest.fn()}
        routePath={mockRoutePath}
        routingGraphVisible={false}
        polygonsVisible={false}
        googleMapsOption={false}
        recenter={false}
        authorization={''}
        geographies={mockGeographies}
        geography={mockGeographies[0]}
        googleRoute={mockRoute}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
})
