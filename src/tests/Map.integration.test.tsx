import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { Checkbox, Dropdown, Input } from 'semantic-ui-react'
import { mockRoute } from '../apiCalls/__mocks__/mockRoute'
import App from '../components/App'
import EndpointRow from '../components/EndpointRow'
import Map from '../components/Map'
import { Tab } from '../components/Tabs'
import { formatCoords } from '../utils/functions'
import { getPath } from '../utils/urlConfig'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const mockEventStart = {
  lngLat: {
    lat: 53,
    lng: 12
  }
}

const mockEventEnd = {
  lngLat: {
    lat: 55,
    lng: 15
  }
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
              />
            )}
          />
        )}
      />
    </MemoryRouter>
  )

const toggleDebug = (root: any, debug: boolean) => {
  const TabComponent = root
    .findAllByType(Tab)
    .filter((el: any) => (debug ? el.props.id === 'default' : el.props.id === 'debug'))[0]
  TabComponent.props.onClick()
}

describe('Start and end points work as expected', () => {
  describe('When user clicks on map', () => {
    const testInstance = getTestApp()

    const root = testInstance.root

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance

    const input = root.findAllByType(Input)

    MapComponent.handleMapClick(mockEventStart)

    it('updates locations object with coordinates', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2)

      const startPoint = locations.find((el: any) => el.name === 'start')

      expect(startPoint.lat).toBe(mockEventStart.lngLat.lat)
      expect(startPoint.lng).toBe(mockEventStart.lngLat.lng)

      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(null)
      expect(endPoint.lng).toBe(null)
    })

    it("updates start input's value", () => {
      const { value: valueStartInput } = input[0].props

      expect(valueStartInput).toBe(formatCoords(mockEventStart.lngLat))
    })

    it('inserts a marker on the map', () => {
      const { markers } = MapComponent.state

      expect(markers.length).toBe(1)
    })

    it('correctly updates the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(4)
      expect(splitUrl[2]).toBe(formatCoords(mockEventStart.lngLat))
      expect(splitUrl[3]).toBe('-')
    })
  })

  describe('When user clicks twice on map', () => {
    const testInstance = getTestApp()

    const root = testInstance.root

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance

    const input = root.findAllByType(Input)

    MapComponent.handleMapClick(mockEventStart)
    MapComponent.handleMapClick(mockEventEnd)

    it('updates locations object with coordinates ', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2)

      const startPoint = locations.find((el: any) => el.name === 'start')
      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(startPoint.lat).toBe(mockEventStart.lngLat.lat)
      expect(startPoint.lng).toBe(mockEventStart.lngLat.lng)
      expect(endPoint.lat).toBe(mockEventEnd.lngLat.lat)
      expect(endPoint.lng).toBe(mockEventEnd.lngLat.lng)
    })

    it("updates start and end inputs' value", () => {
      const { value: valueStartInput } = input[0].props
      const { value: valueEndInput } = input[1].props

      expect(valueStartInput).toBe(formatCoords(mockEventStart.lngLat))
      expect(valueEndInput).toBe(formatCoords(mockEventEnd.lngLat))
    })

    it('inserts a marker on the map', () => {
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

      expect(splitUrl).toHaveLength(4)
      expect(splitUrl[2]).toBe(formatCoords(mockEventStart.lngLat))
      expect(splitUrl[3]).toBe(formatCoords(mockEventEnd.lngLat))
    })
  })
})

describe('When showing the routing graph, the tiles are requested from the expected endpoint', () => {
  const defaultEndpointString = 'https://routing.develop.otonomousmobility.com/${PROFILE}'
  const defaultProfile = 'car'
  const defaultProfileTraffic = 'car-traffic'
  const mockNewEndpointID = 2
  const mockNewEndpointString = 'https://routing.testing.otonomousmobility.com/${PROFILE}'

  describe('When requesting from the blank app', () => {
    const testInstance = getTestApp()

    const root = testInstance.root
    const MapComponent = root.findByType(Map).instance

    toggleDebug(root, MapComponent.props.debug)

    const addSpeedsLayerSpy = jest.spyOn(MapComponent, 'addSpeedsLayer')
    const routingGraphToggler = root.findAllByType(Checkbox).filter(el => {
      return el.props.id === 'routingGraphVisible'
    })[0]

    routingGraphToggler.props.onChange('', { checked: true })

    it('should get the speed layers from the default endpoint', () => {
      expect(addSpeedsLayerSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        defaultProfile,
        defaultEndpointString
      )
    })
  })

  describe('When changing the endpoint the routing graph tiles are requested from the new endpoint', () => {
    const testInstance = getTestApp()

    const root = testInstance.root
    const MapComponent = root.findByType(Map).instance

    toggleDebug(root, MapComponent.props.debug)

    const addSpeedsLayerSpy = jest.spyOn(MapComponent, 'addSpeedsLayer')
    const routingGraphToggler = root.findAllByType(Checkbox).filter(el => {
      return el.props.id === 'routingGraphVisible'
    })[0]

    routingGraphToggler.props.onChange('', { checked: true })

    toggleDebug(root, MapComponent.props.debug)

    const OptionsMenuButton = root.findByProps({ className: 'options-button' })
    OptionsMenuButton.props.onClick()

    const endpointRowComponent = root.findByType(EndpointRow).findByType(Dropdown)
    endpointRowComponent.props.onChange({}, { value: mockNewEndpointID })

    it('should get the routing tiles from the endpoint', () => {
      expect(addSpeedsLayerSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        defaultProfile,
        mockNewEndpointString
      )
    })
  })

  describe('When changing the endpoint to use traffic data the routing graph tiles are requested from the traffic endpoint', () => {
    const testInstance = getTestApp()

    const root = testInstance.root
    const MapComponent = root.findByType(Map).instance

    const trafficOptionToggler = root.findAllByType(Checkbox).filter(el => {
      return el.props.id === 'trafficOption'
    })[0]
    trafficOptionToggler.props.onChange('', { checked: true })

    toggleDebug(root, MapComponent.props.debug)

    const addSpeedsLayerSpy = jest.spyOn(MapComponent, 'addSpeedsLayer')

    const routingGraphToggler = root.findAllByType(Checkbox).filter(el => {
      return el.props.id === 'routingGraphVisible'
    })[0]
    routingGraphToggler.props.onChange('', { checked: true })

    it('should use the traffic profile', () => {
      expect(addSpeedsLayerSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        defaultProfileTraffic,
        defaultEndpointString
      )
    })
  })
})
