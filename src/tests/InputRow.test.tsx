import React from 'react'
import TestRenderer from 'react-test-renderer'
import InputRow from '../components/InputRow'
import { MemoryRouter } from 'react-router-dom'

const urlMatchString = '/:profile/:start/:end'

it('expect to render Panel component', () => {

  const item = { 
    name: 'start', 
    marker: 'map marker alternate',
    placeholder: 'Origin',
    lat: null,
    lng: null
  }

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <InputRow
        rowKey={item.name}
        index={0}
        coords={{lat: 52, lng: 12}}
        placeholder={item.placeholder}
        iconName={item.marker} 
        updatePoint={jest.fn()}
        urlMatchString={urlMatchString}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
