import React from 'react'
import TestRenderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import TextAreaInput from '../components/TextAreaInput';

const mockEventStart = { lng: 13.389869, lat: 52.510348 }
const mockEventEnd = { lng: 13.39114, lat: 52.510425 }

const mockBody = {
  locations: [
    { 
      lat: mockEventStart.lat,
      lon: mockEventStart.lng
    },
    { 
      lat: mockEventEnd.lat,
      lon: mockEventEnd.lng
    },
  ],
  reportGeometry: true,
}


it('expect to render TextAreaInput component', () => {

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <TextAreaInput 
        value={mockBody}
        editableValue={JSON.stringify(mockBody)}
        id={'bodyValue'}
        editJson={false}
        handleValueUpdate={jest.fn()}
        handleInputChange={jest.fn()}
        rows={10}
        color={'rgb(100, 100, 100)'}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
