import React from 'react'
import TestRenderer from 'react-test-renderer'
import OptionsSwitch from '../components/OptionsSwitch'
import { MemoryRouter } from 'react-router-dom'

it('expect to render OptionsPanel component', () => {

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <OptionsSwitch
        checked={false}
        text={'Google Maps'}
        id={'googleMapsOption'}
        updateState={jest.fn()}
        width={'65%'}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
