import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import ProfileToggler from '../components/ProfileToggler'
import { Geography } from '../types'

const geographies: Geography[] = [
  {
    coords: [13.38408, 52.51721],
    polygon: 'berlin.geojson',
    text: 'Berlin',
    value: 0
  },
  {
    coords: [9.033, 48.7111],
    polygon: 'stuttgart.geojson',
    text: 'Stuttgart',
    value: 1
  },
  {
    coords: [8.7214, 47.912],
    polygon: 'immendingen.geojson',
    text: 'Immendingen',
    value: 2
  },
  {
    coords: [-121.97588, 37.34606],
    polygon: 'sunnyvale.geojson',
    text: 'San José',
    value: 3
  }
]

it('expect to render ProfileToggler component', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={['/']}>
      <ProfileToggler
        selectedOption={geographies[0]}
        optionsArray={geographies}
        updateState={jest.fn()}
        id="geography"
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
})
