import React from 'react'
import TestRenderer from 'react-test-renderer'
import InputRow from '../components/InputRow'

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

  const item = { 
    name: 'start', 
    marker: 'map marker alternate',
    placeholder: 'Origin',
    point: null
  }

  const testInstance = TestRenderer.create(
    <InputRow
      rowKey={item.name}
      index={0}
      placeholder={item.placeholder}
      iconName={item.marker} 
      updatePoint={jest.fn()}
    />
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
