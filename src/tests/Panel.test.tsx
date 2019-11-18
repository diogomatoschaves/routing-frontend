import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import Panel from '../components/Panel'

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

const mockTabsHandler = {
  activeIdx: 0,
  options: [
    { key: 'default', text: 'Interactive', value: 0 },
    { key: 'debug', text: 'Debugging', value: 1 }
  ]
}

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

const profiles = [
  {
    iconName: 'car',
    name: 'car'
  },
  {
    iconName: 'male',
    name: 'foot'
  },
  {
    iconName: 'rocket',
    name: 'pilot'
  }
]

it('expect to render Panel component', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={['/']}>
      <Panel
        locations={mockLocations}
        profiles={profiles}
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
