import React from 'react'
import TestRenderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import ProfileToggler from '../components/ProfileToggler';
import { Geography } from '../types';

const geographies: Array<Geography> = [
  {
    text: 'Berlin',
    coords: [13.38408, 52.51721],
    polygon: 'berlin.geojson',
    value: 0
  },
  {
    text: 'Stuttgart',
    coords: [9.033, 48.7111],
    polygon: 'stuttgart.geojson',
    value: 1
  },
  {
    text: 'Immendingen',
    coords: [8.7214, 47.912],
    polygon: 'immendingen.geojson',
    value: 2
  },
  {
    text: 'San José',
    coords: [-121.97588, 37.34606],
    polygon: 'sunnyvale.geojson',
    value: 3
  }
]

it('expect to render ProfileToggler component', () => {

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <ProfileToggler 
        selectedOption={geographies[0]}
        optionsArray={geographies}
        updateState={jest.fn()}
        id='geography'
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
