import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Input } from 'semantic-ui-react'
import mockRoute from '../apiCalls/__mocks__/mockRoute'
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

const mockCoords = {
  lat: 53,
  lng: 12
}

const urlMatchString = '/:profile/:start/:end'

const getTestApp = (initialEntries: Array<string> = ['/']) => TestRenderer.create(
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


describe('Start point Input works as expected on blur', () => {

  describe('When an invalid value is inserted', () => {

    const testInstance = getTestApp()

    const root = testInstance.root
    const input = root.findAllByType(Input);

    input[0].props.onChange('', { value: 'test' })
    input[0].props.onBlur()

    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance

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

  describe('When a valid value is inserted', () => {

    const testInstance = getTestApp()

    const root = testInstance.root
    const input = root.findAllByType(Input);

    input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
    input[0].props.onBlur()
    
    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance
    
    it('does update the locations array with the corresponding change', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')

      expect(startPoint.lat).toBe(mockCoords.lat);
      expect(startPoint.lng).toBe(mockCoords.lng);
    })

    it('inserts a marker on the Map component', () => {
      const { markers } = MapComponent.state
      expect(markers.length).toBe(1)
    })

    it('correctly updates the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(4)
      expect(splitUrl[2]).toBe(formatCoords(mockCoords))
      expect(splitUrl[3]).toBe('-')
    })
  })
})

describe('End point Input works as expected on blur', () => {

  describe('When an invalid value is inserted', () => {

    const testInstance = getTestApp()

    const root = testInstance.root
    const input = root.findAllByType(Input);

    input[1].props.onChange('', { value: 'test' })
    input[1].props.onBlur()
    
    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance

    it('does not update the locations array', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2);

      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(null);
      expect(endPoint.lng).toBe(null);
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

  describe('When a valid value is inserted', () => {

    const testInstance = getTestApp()

    const root = testInstance.root
    const input = root.findAllByType(Input);

    input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
    input[1].props.onBlur()
    
    const AppComponent = root.findByType(App).instance
    const MapComponent = root.findByType(Map).instance
    
    it('does update the locations array with the corresponding value', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2);

      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(mockCoords.lat);
      expect(endPoint.lng).toBe(mockCoords.lng);
    })

    it('inserts a marker on the Map component', () => {
      const { markers } = MapComponent.state

      expect(markers.length).toBe(1)
    })

    it('correctly updates the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(4)
      expect(splitUrl[2]).toBe('-')
      expect(splitUrl[3]).toBe(formatCoords(mockCoords))
    })
  })
})

describe('Route is shown on map when both inputs have valid coordinates', () => {

  const testInstance = getTestApp()

  const root = testInstance.root
  const input = root.findAllByType(Input);

  input[0].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
  input[0].props.onBlur()
  input[1].props.onChange('', { value: `${mockCoords.lat},${mockCoords.lng}` })
  input[1].props.onBlur()
  
  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  it('inserts 2 markers on the Map component', () => {
    const { markers } = MapComponent.state
    expect(markers.length).toBe(2)
  })
  
  it('correctly fetches a route and it is shown to the user', (done) => {
    delay(500)
    .then(() => {
      const { routePath } = MapComponent.props
      expect(routePath).toEqual(mockRoute)
      done()
    })
  })

  it('correctly updates the Url', () => {
    const { location } = AppComponent.props

    const splitUrl = location.pathname.split('/')

    expect(splitUrl).toHaveLength(4)
    expect(splitUrl[2]).toBe(formatCoords(mockCoords))
    expect(splitUrl[3]).toBe(formatCoords(mockCoords))
  })
})

describe('Switching between profiles', () => {

  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  it('Has the right default profile', () => {
    const { profile } = AppComponent.state
    const { location } = AppComponent.props

    expect(profile).toBe('car')

    const splitUrl = location.pathname.split('/')

    expect(splitUrl[1]).toBe('car')
  })

  it('Correctly switches to foot profile on button click', () => {
    const footButton = root.find((el) => el.type === 'div' && el.props.id === 'foot-profile');
  
    footButton.props.onClick() 

    const profile = AppComponent.state.profile
    const location = AppComponent.props.location

    expect(profile).toBe('foot')

    const splitUrl = location.pathname.split('/')

    expect(splitUrl[1]).toBe('foot')
  })
})

