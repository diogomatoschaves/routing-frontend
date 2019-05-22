import React from 'react'
import TestRenderer from 'react-test-renderer'
import InputRow from '../components/InputRow'


it('expect to render Panel component', () => {

  const item = { 
    name: 'start', 
    marker: 'map marker alternate',
    placeholder: 'Origin',
    lat: null,
    lng: null
  }

  const testInstance = TestRenderer.create(
    <InputRow
      rowKey={item.name}
      index={0}
      coords={{lat: 52, lng: 12}}
      placeholder={item.placeholder}
      iconName={item.marker} 
      updatePoint={jest.fn()}
    />
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
