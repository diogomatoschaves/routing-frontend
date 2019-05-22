import React from 'react'
import TestRenderer from 'react-test-renderer'
import Map from '../components/Map'

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

it('expect to render Panel comoponent', () => {
  const testInstance = TestRenderer.create(
    <Map
      locations={mockLocations}
      updatePoint={jest.fn()}
    />
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 