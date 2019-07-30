import React from 'react'
import TestRenderer from 'react-test-renderer'
import { mockCarResponse } from '../apiCalls/__mocks__/mockResponse'
import App from '../components/App'
import Map from '../components/Map'
import DebugPanel from '../components/DebugPanel'
import { Tab } from '../components/Tabs'
import { MemoryRouter, Route } from 'react-router-dom'
import { getPath, formatCoords } from '../utils/functions'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const urlMatchString = '/:profile/:start/:end'

const getTestApp = (initialEntries: Array<string> = ['/'], loadedProp: boolean = false)=> TestRenderer.create(
  <MemoryRouter initialEntries={initialEntries}>
    <Route render={({ location }) => (
      <Route path={getPath(location.pathname)} render={({ location, history, match }) => (
        <App 
          location={location} 
          history={history} 
          match={match} 
          urlMatchString={urlMatchString}
          loadedProp={loadedProp}
        />
      )}/>
    )}/>
  </MemoryRouter>
)

const invalidJson = '{"invalid"}'

const toggleDebug = (root : any, debug: boolean) => {
  const TabComponent = root.findAllByType(Tab).filter((el: any) => debug ? el.props.id === 'debug' : el.props.id === 'default' )[0]
  TabComponent.props.onClick()
}

describe('Behaviour of textarea to add new routes', () => {

  const mockProfile = 'car'
  const mockStart = {
    lat: 53,
    lng: 12
  }
  const mockEnd = {
    lat: 55,
    lng: 15
  }
  const initialState = `/${mockProfile}/${formatCoords(mockStart)}/${formatCoords(mockEnd)}`

  const testInstance = getTestApp([initialState], true)

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  let DebugPanelComponent: any

  const addPolylineSpy = jest.spyOn(MapComponent, 'addPolyline');

  it('markers array has 2 markers', () => {
    const { markers } = MapComponent.state
    expect(markers).toHaveLength(2)
  })

  describe('Behaviour when debug mode is selected', () => {
    beforeAll(() => {
      toggleDebug(root, true)
      DebugPanelComponent = root.findByType(DebugPanel)
    })    

    it('textarea color is not red', () => {
      const { newRouteColor } = DebugPanelComponent.props
      expect(newRouteColor).not.toBe('red')
    })
    
    it('empties markers array', () => {
      const { markers } = MapComponent.state
      expect(markers).toHaveLength(0)
    })
  })

  describe('Behaviour when input is updated with invalid JSON', () => {
    beforeAll(() => {
      AppComponent.handleValueUpdate({ id: 'newRoute', value: invalidJson })
      DebugPanelComponent = root.findByType(DebugPanel)
    })
    
    it('updates the color of the textarea to red', done => {
      delay(500)
      .then(() => {
        const { newRouteColor } = DebugPanelComponent.props
        expect(newRouteColor).toBe('red')
        done()
      })
    })
  })

  describe('Behaviour when input confirm button is pressed with invalid JSON', () => {

    beforeAll(() => {
      AppComponent.handleAddRoute(jest.fn(), invalidJson)
    })
    
    it('does not add a new route', () => { 
      const { addedRoutes } = AppComponent.state
      expect(addedRoutes.length).toBe(0)
    })

    it('does not plot a new polyline on the map', () => {
      const { addedRoutesIds } = MapComponent.state
      expect(addedRoutesIds.length).toBe(0)
    })
  })

  describe('Behaviour when input is updated with valid JSON', () => {

    beforeAll(() => {
      AppComponent.handleValueUpdate({ id: 'newRoute', value: JSON.stringify(mockCarResponse) })
      DebugPanelComponent = root.findByType(DebugPanel)
    })
    
    it('does not update the color of the textarea to red', done => {
      delay(500)
      .then(() => {
        const { newRouteColor } = DebugPanelComponent.props
        expect(newRouteColor).not.toBe('red')
        done()
      })
    })
  })

  describe('Behaviour when input confirm button is pressed with valid JSON', () => {

    beforeAll(() => {
      AppComponent.handleAddRoute(jest.fn(), JSON.stringify(mockCarResponse))
    })
    
    it('adds a new route', () => { 
      const { addedRoutes } = AppComponent.state
      expect(addedRoutes.length).toBe(1)
    })

    it('plots a new polyline on the map and adds markers', () => {
      const { addedRoutesIds, addedRoutesMarkers } = MapComponent.state
      expect(addedRoutesIds.length).toBe(1)
      expect(addedRoutesMarkers.length).toBe(2)
    })

    it('calls the addPolyline method of the Map Component', () => {
      const routePath = mockCarResponse.routes[0].legs[0].geometry
      expect(addPolylineSpy).toHaveBeenCalledWith(
        routePath,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything()
      )
    })
  })

  describe('Behaviour when inserting one more route', () => {

    beforeAll(() => {
      AppComponent.handleAddRoute(jest.fn(), JSON.stringify(mockCarResponse))
    })
    
    it('adds a new route', () => { 
      const { addedRoutes } = AppComponent.state
      expect(addedRoutes.length).toBe(2)
    })

    it('plots a new polyline on the map and adds markers', () => {
      const { addedRoutesIds, addedRoutesMarkers } = MapComponent.state
      expect(addedRoutesIds.length).toBe(2)
      expect(addedRoutesMarkers.length).toBe(4)
    })

    it('calls the addPolyline method of the Map Component', () => {
      const routePath = mockCarResponse.routes[0].legs[0].geometry
      expect(addPolylineSpy).toHaveBeenCalledWith(
        routePath,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything()
      )
    })
  })

  describe('Behaviour when switching back to interactive mode', () => {

    beforeAll(() => {
      toggleDebug(root, false)
    })
    
    it('adds route markers', () => { 
      const { markers } = MapComponent.state
      expect(markers.length).toBe(2)
    })

    it('removes added routes markers', () => {
      const { addedRoutesIds, addedRoutesMarkers } = MapComponent.state
      expect(addedRoutesIds.length).toBe(2)
      expect(addedRoutesMarkers.length).toBe(0)
    })
  })
})



