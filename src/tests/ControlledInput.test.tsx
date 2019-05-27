import React from 'react'
import TestRenderer from 'react-test-renderer'
import ControlledInput from '../components/ControlledInput'


it('expect to render App component', () => {
  const testInstance = TestRenderer.create(
    <ControlledInput  
      updatePoint={jest.fn()}
      updateColor={jest.fn()}
      rowKey='start'
      index={0}
      coords={{lat: 52, lng: 12}}
      placeholder='Origin'
    />)
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
