import React from 'react'
import TestRenderer from 'react-test-renderer'
import App from '../components/App'

// jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
//   GeolocateControl: jest.fn(),
//   Map: jest.fn(() => ({
//     addControl: jest.fn(),
//     on: jest.fn(),
//     remove: jest.fn()
//   })),
//   NavigationControl: jest.fn()
// }));

it('expect to render App component', () => {
  const testInstance = TestRenderer.create(<App/>)
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
