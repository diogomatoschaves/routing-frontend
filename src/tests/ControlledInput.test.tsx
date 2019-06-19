import React from 'react'
import TestRenderer from 'react-test-renderer'
import ControlledInput from '../components/ControlledInput'
import { MemoryRouter } from 'react-router-dom'

const urlMatchString = '/:profile/:start/:end'

it('expect to render App component', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <ControlledInput  
        updatePoint={jest.fn()}
        updateColor={jest.fn()}
        rowKey='start'
        index={0}
        coords={{lat: 52, lng: 12}}
        placeholder='Origin'
        urlMatchString={urlMatchString}
      />
    </MemoryRouter>)

  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
