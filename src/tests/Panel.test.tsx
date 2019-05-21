import React from 'react'
import TestRenderer from 'react-test-renderer'
import Panel from '../components/Panel'

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  GeolocateControl: jest.fn(),
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
    remove: jest.fn()
  })),
  NavigationControl: jest.fn()
}));

const mockLocations = [{ 
  name: 'start', 
  marker: 'map marker alternate',
  placeholder: 'Origin',
  point: null
}, { 
  name: 'end', 
  marker: 'flag checkered',
  placeholder: 'Destination',
  point: null
}]

it('expect to render Panel component', () => {

  const testInstance = TestRenderer.create(<Panel locations={mockLocations}/>)
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
