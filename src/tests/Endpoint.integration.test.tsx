import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { Dropdown, Input } from 'semantic-ui-react'
import App from '../components/App'
import EndpointRow from '../components/EndpointRow'
import { Option } from '../types'
import { formatCoords } from '../utils/functions'
import { getPath, urlMatchString } from '../utils/urlConfig'

jest.mock('../apiCalls')

const mockCoords = {
  lat: 53,
  lon: 12
}

const mockCoords2 = {
  lat: 55,
  lon: 15
}

const defaultEndpointID = 0
const mockNewEndpointID = 2
const mockNewEndpointString = 'https://routing.testing.otonomousmobility.com/${PROFILE}'
const mockNewCustomEndpoint = 'http://localhost:5001'

const setCoordinates = (input: any) => {
  input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lon}` })
  input[0].props.onBlur()
  input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lon}` })
  input[1].props.onBlur()
}

const expectGetRouteToUseCorrectEndpoint = (
  getRouteSpy: any,
  expectedEndpoint: string
) => {
  expect(getRouteSpy).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    expect.anything(),
    expect.anything(),
    null,
    expect.anything(),
    expect.anything(),
    expectedEndpoint
  )
}

const getTestApp = (initialEntries = ['/']) =>
  TestRenderer.create(
    <MemoryRouter initialEntries={initialEntries}>
      <Route
        render={({ location }) => (
          <Route
            path={getPath(location.pathname)}
            render={({ location: newLocation, history, match }) => (
              <App
                location={newLocation}
                history={history}
                match={match}
                urlMatchString={urlMatchString}
              />
            )}
          />
        )}
      />
    </MemoryRouter>
  )

describe('On a blank app, use the correct expected endpoint when requesting routes', () => {
  describe('When there is a blank App', () => {
    // get a blank map
    const testInstance = getTestApp()
    const root = testInstance.root
    const AppComponent = root.findByType(App).instance
    it('Has the right default endpoint', () => {
      const { endpointHandler } = AppComponent.state
      expect(endpointHandler.activeIdx).toBe(defaultEndpointID)
    })
  })

  describe('When another endpoint is being selected from the dropdown', () => {
    // get a blank map
    const testInstance = getTestApp()
    const root = testInstance.root

    // choose the second dropdown item as the new enpoint
    const AppComponent = root.findByType(App).instance
    const endpointRowComponent = root.findByType(EndpointRow).findByType(Dropdown)
    endpointRowComponent.props.onChange({}, { value: mockNewEndpointID })

    it('updates the endpointHandler according to the selected endpoint', () => {
      const { endpointHandler } = AppComponent.state
      expect(endpointHandler.activeIdx).toBe(mockNewEndpointID)
    })

    it('sends the next route request to the selected endpoint', () => {
      const getRouteSpy = jest.spyOn(AppComponent, 'getRoutes')

      // set coordinates to trigger a route request
      setCoordinates(root.findAllByType(Input))

      // check getRoutes is being called with the correct endpoint
      expectGetRouteToUseCorrectEndpoint(getRouteSpy, mockNewEndpointString)
    })
  })
  describe('When a customized endpoint is entered, the routes are requested from the expected endpoint', () => {
    // get a blank map
    const testInstance = getTestApp()
    const root = testInstance.root

    // add a new custom endpoint
    const AppComponent = root.findByType(App).instance
    const endpointRowComponent = root.findByType(EndpointRow).findByType(Dropdown)
    endpointRowComponent.props.onAddItem({}, { value: mockNewCustomEndpoint })

    it('stores the new endpoint and selects it in the endpointHandler', () => {
      const { endpointHandler } = AppComponent.state
      const customEndpoint = endpointHandler.options.find(
        (option: Option) => option.text === mockNewCustomEndpoint
      )
      expect(customEndpoint).toBeDefined()
      expect(endpointHandler.activeIdx).toBe(customEndpoint.value)
    })
    it('sends the next route request to the new endpoint', () => {
      const getRouteSpy = jest.spyOn(AppComponent, 'getRoutes')

      // set coordinates to trigger a route request
      setCoordinates(root.findAllByType(Input))

      // check getRoutes is being called with the new endpoint
      expectGetRouteToUseCorrectEndpoint(getRouteSpy, mockNewCustomEndpoint)
    })
  })
})

describe('When there is already a route being displayed, choosing another endpoint updates the route as expected', () => {
  const mockProfile = 'car'
  const mockUrl = `/${mockProfile}/${formatCoords(mockCoords)}/${formatCoords(
    mockCoords2
  )}`
  const testInstance = getTestApp([mockUrl])
  const root = testInstance.root

  it('updates the route that is being displayed when selecting another endpoint', () => {
    const AppComponent = root.findByType(App).instance
    const getRouteSpy = jest.spyOn(AppComponent, 'getRoutes')

    // choose the second dropdown item as the new enpoint
    const endpointRowComponent = root.findByType(EndpointRow).findByType(Dropdown)
    endpointRowComponent.props.onChange({}, { value: mockNewEndpointID })

    // check getRoutes is being called with the correct endpoint
    expectGetRouteToUseCorrectEndpoint(getRouteSpy, mockNewEndpointString)
  })
  it('updates the route that is being displayed when a new custom endpoint is entered', () => {
    const AppComponent = root.findByType(App).instance
    const getRouteSpy = jest.spyOn(AppComponent, 'getRoutes')

    // add a new custom endpoint
    const endpointRowComponent = root.findByType(EndpointRow).findByType(Dropdown)
    endpointRowComponent.props.onAddItem({}, { value: mockNewCustomEndpoint })

    // check getRoutes is being called with the new endpoint
    expectGetRouteToUseCorrectEndpoint(getRouteSpy, mockNewEndpointString)
  })
})
