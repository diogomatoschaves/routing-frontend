import React from 'react'
import TestRenderer from 'react-test-renderer'
import Panel from '../components/App'

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  GeolocateControl: jest.fn(),
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
    remove: jest.fn()
  })),
  NavigationControl: jest.fn()
}));

it('expect to render Panel component', () => {
  const testInstance = TestRenderer.create(<Panel/>)
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
