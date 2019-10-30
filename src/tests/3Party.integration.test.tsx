import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { Checkbox, Input } from 'semantic-ui-react'
import { googleDirections } from '../apiCalls'
import { mockGoogleRoute, mockRoute } from '../apiCalls/__mocks__/mockRoute'
import App from '../components/App'
import Map from '../components/Map'
import { getPath } from '../utils/urlConfig'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const mockCoords = {
  lat: 53,
  lng: 12
}

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

const urlMatchString = '/:profile/:start/:end'

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
                windowProp={true}
              />
            )}
          />
        )}
      />
    </MemoryRouter>
  )

describe('When 3rd party option is selected', () => {
  const testInstance = getTestApp()

  it('has not called the googleDirections API yet', done => {
    expect(googleDirections).toBeCalledTimes(0)
    done()
  })

  describe('When 2 valid values are inserted on input boxes', () => {
    const root = testInstance.root
    const MapComponent = root.findByType(Map).instance

    beforeAll(() => {
      toggle(
        root,
        {
          id: 'googleMapsOption',
          text: 'Google'
        },
        true
      )

      const input = root.findAllByType(Input)

      // act(() => {
      input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
      input[0].props.onBlur()
      input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
      input[1].props.onBlur()
      // })
    })

    it('calls the googleDirections API once', done => {
      expect(googleDirections).toBeCalledTimes(1)
      done()
    })

    it('The Map component receives a routing-service and google maps route', done => {
      delay(500).then(() => {
        const { routes } = MapComponent.props
        expect(routes.googleRoute.routePath).toEqual(mockGoogleRoute)
        expect(routes.route.routePath).toEqual(mockRoute)
        done()
      })
    })
  })

  describe('When google option is unchecked', () => {
    const root = testInstance.root
    const AppComponent = root.findByType(App).instance

    beforeAll(() => {
      toggle(
        root,
        {
          id: 'googleMapsOption',
          text: 'Google'
        },
        false
      )
    })

    it('the google route is updated to the defaultRoute', done => {
      delay(0).then(() => {
        const { routes } = AppComponent.state

        expect(routes.trafficRoute.duration).toEqual(0)
        expect(routes.route.routePath).toEqual(mockRoute)
        done()
      })
    })

    it('does not call the googledirections Api', done => {
      expect(googleDirections).toBeCalledTimes(1)
      done()
    })
  })

  describe('When google option is reselected', () => {
    const root = testInstance.root
    const MapComponent = root.findByType(Map).instance

    beforeAll(() => {
      toggle(
        root,
        {
          id: 'googleMapsOption',
          text: 'Google'
        },
        true
      )
    })

    it('calls the googleDirections API once more', done => {
      expect(googleDirections).toBeCalledTimes(2)
      done()
    })

    it('the Map component receives the updated Route', done => {
      delay(500).then(() => {
        const { routes } = MapComponent.props
        expect(routes.googleRoute.routePath).toEqual(mockGoogleRoute)
        done()
      })
    })
  })
})
