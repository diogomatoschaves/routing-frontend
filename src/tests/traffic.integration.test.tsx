import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { Checkbox, Input } from 'semantic-ui-react'
import { routingApi } from '../apiCalls'
import { mockRoute } from '../apiCalls/__mocks__/mockRoute'
import App from '../components/App'
import Map from '../components/Map'
import { getPath, urlMatchString } from '../utils/urlConfig'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const mockCoords = {
  lat: 53,
  lon: 12
}

const getTestApp = (initialEntries: string[] = ['/']) =>
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

const toggle = (
  root: any,
  togglerProps: { text: string; id: string },
  checked: boolean
) => {
  const Toggler = root.findAllByType(Checkbox).filter((el: any) => {
    return el.props.id === togglerProps.id
  })[0]

  Toggler.props.onChange('', { checked })
}

describe('When traffic option is selected', () => {
  const testInstance = getTestApp()

  const root = testInstance.root
  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  it('has not called the routing API yet', done => {
    expect(routingApi).toHaveBeenCalledTimes(0)
    done()
  })

  describe('When 2 valid values are inserted on input boxes', () => {
    beforeAll(() => {
      toggle(
        root,
        {
          id: 'trafficOption',
          text: 'Traffic'
        },
        true
      )

      const input = root.findAllByType(Input)

      input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lon}` })
      input[0].props.onBlur()
      input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lon}` })
      input[1].props.onBlur()
    })

    it('calls the routing API twice', done => {
      expect(routingApi).toBeCalledTimes(2)
      done()
    })

    it('correctly fetches a routing-service both with traffic and without, and the Map component receives it', done => {
      delay(500).then(() => {
        const { routes } = MapComponent.props
        expect(routes.trafficRoute.routePath).toEqual(mockRoute)
        expect(routes.route.routePath).toEqual(mockRoute)
        done()
      })
    })
  })

  describe('When traffic option is unchecked', () => {
    beforeAll(() =>
      toggle(
        root,
        {
          id: 'trafficOption',
          text: 'Traffic'
        },
        false
      )
    )

    it('the traffic route is updated to the defaultRoute', done => {
      delay(0).then(() => {
        const { routes, trafficOption } = AppComponent.state

        expect(routes.trafficRoute.duration).toEqual(0)
        expect(routes.route.routePath).toEqual(mockRoute)
        done()
      })

      expect(routingApi).toBeCalledTimes(2)
      done()
    })
  })

  describe('When traffic option is reselected', () => {
    beforeAll(() => {
      toggle(
        root,
        {
          id: 'trafficOption',
          text: 'Traffic'
        },
        true
      )
    })

    it('calls the routing API once more', done => {
      expect(routingApi).toBeCalledTimes(3)
      done()
    })

    it('the Map component receives the updated Route', done => {
      const { routes } = AppComponent.state
      expect(routes.trafficRoute.routePath).toEqual(mockRoute)
      done()
    })
  })
})
