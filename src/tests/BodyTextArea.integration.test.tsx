import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Input } from 'semantic-ui-react'
import { routingApi } from '../apiCalls'
import App from '../components/App'
import Map from '../components/Map'
import { MemoryRouter, Route } from 'react-router-dom'
import { getPath, formatCoords } from '../utils/functions'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

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

const getTestApp = (initialEntries: Array<string> = ['/'])=> TestRenderer.create(
  <MemoryRouter initialEntries={initialEntries}>
    <Route render={({ location }) => (
      <Route path={getPath(location.pathname)} render={({ location, history, match }) => (
        <App 
          location={location} 
          history={history} 
          match={match} 
          urlMatchString={urlMatchString}
        />
      )}/>
    )}/>
  </MemoryRouter>
)

const urlMatchString = '/:profile/:start/:end'

describe('Body Textarea works as expected on blur', () => {

  describe('When an invalid json format / schema is inserted', () => {

    const testInstance = getTestApp()

    const root = testInstance.root
    const OptionsMenuButton = root.findByProps({ className: 'options-button' })

    OptionsMenuButton.props.onClick()

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance
    const input = root.findAllByType(Input)
    const SideBarComponent = root.findByProps({ className: "body-textarea" })

    SideBarComponent.props.onClick('', { id: 'bodyEdit' })
            
    const TextAreaInstance = root.findByProps({ id: 'bodyValue', className: 'textarea' })

    TextAreaInstance.props.onChange('', { id: 'bodyValue', value: JSON.stringify({ locations: [] }) })
    TextAreaInstance.props.onBlur('')

    it('does not update start and end inputs\' value', () => {
      const { value: valueStartInput } = input[0].props
      const { value: valueEndInput } = input[1].props

      expect(valueStartInput).toBe("")
      expect(valueEndInput).toBe("")
    })

    it('does not update the locations array', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')

      expect(startPoint.lat).toBe(null);
      expect(startPoint.lng).toBe(null);
    })

    it('does not insert a marker on the Map component', () => {
      const { markers } = MapComponent.state
      expect(markers.length).toBe(0)
    })

    it('does not update the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(2)
    })

  })

  describe('When a valid json format / schema is inserted', () => {

    const testInstance = getTestApp()

    const root = testInstance.root
    const OptionsMenuButton = root.findByProps({ className: 'options-button' })

    OptionsMenuButton.props.onClick()

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance
    const input = root.findAllByType(Input)
    const SideBarComponent = root.findByProps({ className: "body-textarea" })

    SideBarComponent.props.onClick('', { id: 'bodyEdit' })
            
    const TextAreaInstance = root.findByProps({ id: 'bodyValue', className: 'textarea' })

    TextAreaInstance.props.onChange('', { id: 'bodyValue', value: JSON.stringify(mockBody) })
    TextAreaInstance.props.onBlur('')

    it('updates locations object with coordinates ', () => {

      const { locations } = MapComponent.props

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')
      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(startPoint.lat).toBe(mockEventStart.lat);
      expect(startPoint.lng).toBe(mockEventStart.lng);
      expect(endPoint.lat).toBe(mockEventEnd.lat);
      expect(endPoint.lng).toBe(mockEventEnd.lng);
    })

    it('updates start and end inputs\' value', () => {
      const { value: valueStartInput } = input[0].props
      const { value: valueEndInput } = input[1].props

      expect(valueStartInput).toBe(formatCoords(mockEventStart))
      expect(valueEndInput).toBe(formatCoords(mockEventEnd))
    })

    it('inserts markers on the map', () => {
      const { markers } = MapComponent.state
      expect(markers.length).toBe(2)
    })

    it('calls the routing API once', (done) => {
      expect(routingApi).toBeCalledTimes(1)
      done()
    })

    it('correctly updates the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(4)
      expect(splitUrl[2]).toBe(formatCoords(mockEventStart))
      expect(splitUrl[3]).toBe(formatCoords(mockEventEnd))
    })
  })
})