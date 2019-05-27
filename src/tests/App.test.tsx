import React from 'react'
import TestRenderer from 'react-test-renderer'
import App from '../components/App'


it('expect to render App component', () => {
  const testInstance = TestRenderer.create(<App/>)
  expect(testInstance.toJSON()).toMatchSnapshot()
}) 
