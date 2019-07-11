import React from 'react'
import TestRenderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import ProfileToggler from '../components/ProfileToggler';

const geographies = [
  {
    name: 'Berlin',
    coords: [13.38408, 52.51721],
    polygon: 'berlin.geojson'
  },
  {
    name: 'Stuttgart',
    coords: [9.033, 48.7111],
    polygon: 'stuttgart.geojson'
  },
  {
    name: 'Immendingen',
    coords: [8.7214, 47.912],
    polygon: 'immendingen.geojson'
  },
  {
    name: 'San José',
    coords: [-121.97588, 37.34606],
    polygon: 'sunnyvale.geojson'
  }
]

it('expect to render ProfileToggler component', () => {

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <ProfileToggler 
        geography={geographies[0]}
        geographies={geographies}
        updateState={jest.fn()}
        id='geography'
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
