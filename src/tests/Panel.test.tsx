import React from 'react'
import TestRenderer from 'react-test-renderer'
import Panel from '../components/Panel'
import { MemoryRouter } from 'react-router-dom'


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

const mockTabsHandler = {
  options: [
    { key: 'default', text: 'Interactive', value: 0 },
    { key: 'debug', text: 'Debugging', value: 1 }
  ],
  activeIdx: 0
}

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


it('expect to render Panel component', () => {

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <Panel 
        locations={mockLocations}
        updatePoint={jest.fn()}
        updateState={jest.fn()}
        handleValueUpdate={jest.fn()}
        handleShowClick={jest.fn()}
        routingGraphVisible={false}
        polygonsVisible={false}
        googleMapsOption={false}
        recenter={false}
        authorization={''}
        geographies={mockGeographies}
        geography={mockGeographies[0]}
        debug={false}
        modeTabsHandler={mockTabsHandler}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
