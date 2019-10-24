import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import App from '../components/App'

const mockMatch = {
  isExact: true,
  params: {
    profile: 'car',
    start: '52.5332192, 13.3329111',
    end: '52.5160144, 13.3820557'
  },
  path: '/:profile/:start/:end',
  url: '/car/52.5332192, 13.3329111/52.5160144, 13.3820557'
}

it('expect to render App component', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={['/']}>
      <App match={mockMatch} />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
})
