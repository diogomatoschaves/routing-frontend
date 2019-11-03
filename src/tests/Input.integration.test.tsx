import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { Checkbox, Input } from 'semantic-ui-react'
import { mockGoogleRoute, mockRoute } from '../apiCalls/__mocks__/mockRoute'
import App from '../components/App'
import Map from '../components/Map'
import { formatCoords } from '../utils/functions'
import { getPath, matchingParams, urlMatchString } from '../utils/urlConfig'

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

const getTestApp = (
  initialEntries: string[] = ['/'],
  loadedProp: boolean = true,
  windowProp: boolean = true
) =>
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
                windowProp={windowProp}
                loadedProp={loadedProp}
              />
            )}
          />
        )}
      />
    </MemoryRouter>
  )

describe('Start point Input works as expected on blur', () => {
  describe('When an invalid value is inserted', () => {
    const testInstance = getTestApp()

    const root = testInstance.root
    const input = root.findAllByType(Input)

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance

    beforeAll(() => {
      input[0].props.onChange('', { value: 'test' })
      input[0].props.onBlur()
    })

    it('does not update the locations array', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2)

      const startPoint = locations.find((el: any) => el.name === 'start')

      expect(startPoint.lat).toBe(null)
      expect(startPoint.lng).toBe(null)
    })

    it('does not insert a marker on the Map component', () => {
      const { markers } = MapComponent.state
      expect(markers.length).toBe(0)
    })

    it('does not update the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(matchingParams.length + 1)
    })
  })

  describe('When a valid value is inserted', () => {
    const testInstance = getTestApp()

    const root = testInstance.root
    const input = root.findAllByType(Input)

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance

    beforeAll(() => {
      input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
      input[0].props.onBlur()
    })

    it('does update the locations array with the corresponding change', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2)

      const startPoint = locations.find((el: any) => el.name === 'start')

      expect(startPoint.lat).toBe(mockCoords.lat)
      expect(startPoint.lng).toBe(mockCoords.lng)
    })

    it('inserts a marker on the Map component', () => {
      const { markers } = MapComponent.state
      expect(markers.length).toBe(1)
    })

    it('correctly updates the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(matchingParams.length + 1)
      expect(splitUrl[2]).toBe(`${formatCoords(mockCoords)};-`)
    })
  })
})

describe('End point Input works as expected on blur', () => {
  describe('When an invalid value is inserted', () => {
    const testInstance = getTestApp()

    const root = testInstance.root
    const input = root.findAllByType(Input)

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance

    beforeAll(() => {
      input[1].props.onChange('', { value: 'test' })
      input[1].props.onBlur()
    })

    it('does not update the locations array', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2)

      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(null)
      expect(endPoint.lng).toBe(null)
    })

    it('does not insert a marker on the Map component', () => {
      const { markers } = MapComponent.state
      expect(markers.length).toBe(0)
    })

    it('does not update the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(matchingParams.length + 1)
    })
  })

  describe('When a valid value is inserted', () => {
    const testInstance = getTestApp()

    const root = testInstance.root
    const input = root.findAllByType(Input)

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance

    beforeAll(() => {
      input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
      input[1].props.onBlur()
    })

    it('does update the locations array with the corresponding value', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2)

      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(mockCoords.lat)
      expect(endPoint.lng).toBe(mockCoords.lng)
    })

    it('inserts a marker on the Map component', () => {
      const { markers } = MapComponent.state

      expect(markers.length).toBe(1)
    })

    it('correctly updates the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(matchingParams.length + 1)
      expect(splitUrl[2]).toBe(`-;${formatCoords(mockCoords)}`)
    })
  })
})

describe('Route is shown on map when both inputs have valid coordinates', () => {
  const testInstance = getTestApp()

  const root = testInstance.root
  const input = root.findAllByType(Input)

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  beforeAll(() => {
    input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
    input[0].props.onBlur()
    input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
    input[1].props.onBlur()
  })

  it('inserts 2 markers on the Map component', () => {
    const { markers } = MapComponent.state
    expect(markers.length).toBe(2)
  })

  it('correctly fetches a route and it is shown to the user', done => {
    delay(500).then(() => {
      const { route } = MapComponent.props.routes
      expect(route.routePath).toEqual(mockRoute)
      done()
    })
  })

  it('correctly updates the Url', () => {
    const { location } = AppComponent.props

    const splitUrl = location.pathname.split('/')

    expect(splitUrl).toHaveLength(matchingParams.length + 1)
    expect(splitUrl[2]).toBe(`${formatCoords(mockCoords)};${formatCoords(mockCoords)}`)
  })
})

describe('Switching between profiles', () => {
  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  describe('Before any change', () => {
    it('Has the right default profile', () => {
      const { profile } = AppComponent.state
      const { location } = AppComponent.props

      expect(profile).toBe('car')

      const splitUrl = location.pathname.split('/')

      expect(splitUrl[1]).toBe('car')
    })
  })

  describe('Behaviour when foot profile is switched', () => {
    beforeAll(() => {
      const footButton = root.find(
        el => el.type === 'div' && el.props.id === 'foot-profile'
      )
      footButton.props.onClick()
    })

    it('Correctly switches to foot profile ', () => {
      const profile = AppComponent.state.profile
      const location = AppComponent.props.location

      expect(profile).toBe('foot')

      const splitUrl = location.pathname.split('/')

      expect(splitUrl[1]).toBe('foot')
    })
  })
})

describe('Deleting one of the coordinates', () => {
  const testInstance = getTestApp()

  const root = testInstance.root

  const MapComponent = root.findByType(Map).instance

  beforeAll(() => {
    toggle(
      root,
      {
        id: 'trafficOption',
        text: 'Traffic'
      },
      true
    )

    toggle(
      root,
      {
        id: 'googleMapsOption',
        text: 'Compare 3rd Party'
      },
      true
    )
  })

  describe('Behaviour when input is deleted', () => {
    beforeAll(() => {
      const input = root.findAllByType(Input)
      input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
      input[0].props.onBlur()
      input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
      input[1].props.onBlur()
    })

    it('correctly fetches a routing responses, and the Map component receives it', done => {
      delay(1000).then(() => {
        const { routes } = MapComponent.props

        expect(routes.trafficRoute.routePath).toEqual(mockRoute)
        expect(routes.googleRoute.routePath).toEqual(mockGoogleRoute)
        expect(routes.route.routePath).toEqual(mockRoute)
        done()
      })
    })
  })

  describe('Behaviour when input is deleted', () => {
    beforeAll(() => {
      const input = root.findAllByType(Input)
      input[0].props.onChange('', { value: '' })
      input[0].props.onBlur()
    })

    it('eliminates all routes', done => {
      delay(500).then(() => {
        const { routes } = MapComponent.props

        expect(routes.trafficRoute.routePath).toEqual([{ lat: 0, lon: 0 }])
        expect(routes.route.routePath).toEqual([{ lat: 0, lon: 0 }])
        expect(routes.googleRoute.routePath).toEqual([{ lat: 0, lon: 0 }])
        done()
      })
    })
  })
})

describe('Behaviour when response returns no result', () => {
  const testInstance = getTestApp()

  const root = testInstance.root
  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  let removeSourceLayerSpy: any
  let addPolylineSpy: any

  const input = root.findAllByType(Input)

  beforeAll(() => {
    toggle(
      root,
      {
        id: 'trafficOption',
        text: 'Traffic'
      },
      true
    )

    toggle(
      root,
      {
        id: 'googleMapsOption',
        text: 'Compare 3rd Party'
      },
      true
    )

    input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
    input[0].props.onBlur()
    input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
    input[1].props.onBlur()
  })

  it('the messages are all null', () => {
    const { routeMessage, trafficMessage, googleMessage } = AppComponent.state.messages

    expect(routeMessage).toBe(null)
    expect(trafficMessage).toBe(null)
    expect(googleMessage).toBe(null)
  })

  describe('Behaviour when routing-service and google responses have no results', () => {
    beforeAll(() => {
      const mockCoordsInner = {
        lat: 100,
        lng: 100
      }

      removeSourceLayerSpy = jest.spyOn(MapComponent, 'removeSourceLayer')
      addPolylineSpy = jest.spyOn(MapComponent, 'addPolyline')

      input[0].props.onChange('', {
        value: `${mockCoordsInner.lat},${mockCoordsInner.lng}`
      })
      input[0].props.onBlur()
      input[1].props.onChange('', {
        value: `${mockCoordsInner.lat},${mockCoordsInner.lng}`
      })
      input[1].props.onBlur()
    })

    it('updates the message variables', done => {
      delay(500).then(() => {
        const {
          routeMessage,
          trafficMessage,
          googleMessage
        } = AppComponent.state.messages

        expect(routeMessage).not.toBe(null)
        expect(trafficMessage).not.toBe(null)
        expect(googleMessage).not.toBe(null)
        done()
      })
    })

    it('removes the polylines from the map', () => {
      expect(removeSourceLayerSpy).toHaveBeenCalled()
      expect(addPolylineSpy).toHaveBeenCalledTimes(0)
    })
  })
})
