import React from 'react'
import TestRenderer from 'react-test-renderer'
import Panel from '../components/Panel'


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

it('expect to render Panel component', () => {

  const testInstance = TestRenderer.create(<Panel locations={mockLocations}/>)
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 