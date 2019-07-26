import React from 'react'
import TestRenderer from 'react-test-renderer'
import { mockCarResponse } from '../apiCalls/__mocks__/mockResponse'
import App from '../components/App'
import Map from '../components/Map'
import DebugPanel from '../components/DebugPanel'
import { Tab } from '../components/Tabs'
import { MemoryRouter, Route } from 'react-router-dom'
import { getPath } from '../utils/functions'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

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

const invalidJson = '{"invalid"}'

const toggleDebug = (root : any) => {
  const TabComponent = root.findAllByType(Tab).filter((el: any) => el.props.id === 'debug' )[0]
  TabComponent.props.onClick()
}

describe('Behaviour of textarea to add new routes', () => {

  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  toggleDebug(root)

  const DebugPanelComponent = root.findByType(DebugPanel)

  const addPolylineSpy = jest.spyOn(MapComponent, 'addPolyline');

  it('does not update the color of the textarea to red', () => {
    const { newRouteColor } = DebugPanelComponent.props
    expect(newRouteColor).not.toBe('red')
  })

  describe('Behaviour when input is updated with invalid JSON', () => {

    beforeAll(() => {
      AppComponent.handleValueUpdate({ id: 'newRoute', value: invalidJson })
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

    it('plots a new polyline on the map', () => {
      const { addedRoutesIds } = MapComponent.state
      expect(addedRoutesIds.length).toBe(1)
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
})



