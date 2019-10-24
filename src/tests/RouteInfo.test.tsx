import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import RouteInfo from '../components/RouteInfo'

const mockRoute = {
  distance: null,
  duration: null,
  routePath: null
}

const mockColor = '#000000'

it('expect to render ProfileToggler component', () => {
  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={['/']}>
      <RouteInfo
        statsColor={mockColor}
        textColor={mockColor}
        iconColor={mockColor}
        title={'Routing Service'}
        subTitle={'With Traffic'}
        route={mockRoute}
        top={'1px'}
        right={'1px'}
      />
    </MemoryRouter>
  )
  expect(testInstance.toJSON()).toMatchSnapshot()
})
