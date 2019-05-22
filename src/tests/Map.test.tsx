import React from 'react'
import TestRenderer from 'react-test-renderer'
import Map from '../components/Map'
// import mapboxMock from './__mocks__/mapbox'


// console.log(mapboxMock)

// jest.mock('mapbox-gl/dist/mapbox-gl', mapboxMock)

jest.mock('mapbox-gl')

// jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
//   GeolocateControl: jest.fn(),
//   Map: jest.fn(() => ({
//     addControl: jest.fn(),
//     on: jest.fn(),
//     remove: jest.fn()
//   })),
//   NavigationControl: jest.fn()
// }));

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