import React from 'react'
import TestRenderer from 'react-test-renderer'
import Map from '../components/Map'
import { MemoryRouter } from 'react-router-dom'


const mockGeographies = [{
  name: 'Berlin',
  coords: [13.38408, 52.51721],
  polygon: 'berlin.geojson'
}, {
  name: 'Stuttgart',
  coords: [9.033, 48.7111],
  polygon: 'stuttgart.geojson'
}, {
  name: 'Immendingen',
  coords: [8.7214, 47.912],
  polygon: 'immendingen.geojson'
}, {
  name: 'San José',
  coords: [-121.97588, 37.34606],
  polygon: 'sunnyvale.geojson'
}]

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

const mockRoutePath = [
  {lat: 52.5184035, lon: 13.3818403}, 
  {lat: 52.5108246, lon: 13.3953626}
]

it('expect to render Panel comoponent', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <Map
        locations={mockLocations}
        updatePoint={jest.fn()}
        updateState={jest.fn()}
        routePath={mockRoutePath}
        routingGraphVisible={false}
        polygonsVisible={false}
        recenter={false}
        authorization={''}
        geographies={mockGeographies}
        geography={mockGeographies[0]}
  
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 