import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import InputRow from '../components/InputRow'

const urlMatchString = '/:profile/:start/:end'

it('expect to render Panel component', () => {
  const item = {
    lat: null,
    lon: null,
    marker: 'map marker alternate',
    name: 'start',
    placeholder: 'Origin'
  }

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={['/']}>
      <InputRow
        rowKey={item.name}
        index={0}
        coords={{ lat: 52, lon: 12 }}
        placeholder={item.placeholder}
        iconName={item.marker}
        updatePoint={jest.fn()}
        urlMatchString={urlMatchString}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
})
