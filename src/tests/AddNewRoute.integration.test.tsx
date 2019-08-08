import React from 'react'
import TestRenderer from 'react-test-renderer'
import { mockCarResponse } from '../apiCalls/__mocks__/mockResponse'
import App from '../components/App'
import Map from '../components/Map'
import DebugPanel from '../components/DebugPanel'
import RoutesFromDB from '../components/RoutesFromDB'
import Route from '../components/Route'
import StyledInput from '../styledComponents/StyledInput'
import { Tab } from '../components/Tabs'
import { fetchRouteDB } from '../apiCalls'
import { MemoryRouter, Route as RouteURL } from 'react-router-dom'
import { getPath, formatCoords } from '../utils/functions'
import AddDataInput from '../components/AddDataInput';
import { StyledButton } from '../styledComponents';

jest.mock('../apiCalls')
// jest.mock('../components/AddDataInput', () => {

// })

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const urlMatchString = '/:profile/:start/:end'

const getTestApp = (initialEntries: Array<string> = ['/'], loadedProp: boolean = false)=> TestRenderer.create(
  <MemoryRouter initialEntries={initialEntries}>
    <RouteURL render={({ location }) => (
      <RouteURL path={getPath(location.pathname)} render={({ location, history, match }) => (
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

const selectTab = (root : any, key: string) => {
  const TabComponent = root.findAllByType(Tab).filter((el: any) => el.props.id === key)[0]
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
      selectTab(root, 'debug')
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
      selectTab(root, 'default')
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

describe('Behaviour of option to load routes from DB', () => {

  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  let DebugPanelComponent: any
  let RoutesFromDBComponent: any
  let SearchInputComponent: any
  let AddDataInputComponent: any
  let AddButton: any

  selectTab(root, 'debug')
  DebugPanelComponent = root.findByType(DebugPanel)
  AddDataInputComponent = DebugPanelComponent.findByType(AddDataInput)
  selectTab(root, 'db')
  RoutesFromDBComponent = AddDataInputComponent.findByType(RoutesFromDB)
  SearchInputComponent = AddDataInputComponent.findByType(StyledInput)

  describe('When user types something in search box with an unretrievable id', () => {
    beforeAll(() => {
      SearchInputComponent.props.onChange('', { value: '1' })
    })

    it('correctly calls the fetch route from db endpoint', (done) => {
      delay(500)
      .then(() => {
        expect(fetchRouteDB).toBeCalledTimes(1)
        done()
      })
    })

    it('does not show any results', () => {
      const { routes } = RoutesFromDBComponent.instance.state
      expect(routes.length).toBe(0)
    })
  })

  describe('When user types a retrievable value in search box', () => {
    beforeAll(() => {
      SearchInputComponent.props.onChange('', { value: 'AAA' })
    })

    it('correctly calls the fetch route from db endpoint', (done) => {
      delay(500)
      .then(() => {
        expect(fetchRouteDB).toBeCalledTimes(2)
        done()
      })
    })

    it('shows 1 route result and added routes is still 0', () => {
      const { routes } = RoutesFromDBComponent.instance.state
      const { addedRoutes } = AppComponent.state

      expect(routes.length).toBe(1)
      expect(addedRoutes.length).toBe(0)
    })
  })

  describe('When user presses Add Button', () => {
    beforeAll(() => {
      AddButton = RoutesFromDBComponent.findByType(Route).findByType(StyledButton)
      AddButton.props.onClick()
    })

    it('correctly adds a route to addedRoutes', () => {
      const { addedRoutes } = AppComponent.state
      expect(addedRoutes.length).toBe(1)
    })

    it('changes the color of button to red', () => {
      const { color } = AddButton.props
      expect(color).toBe('red')
    })
  })

  describe('When user presses Remove Button', () => {
    beforeAll(() => {
      AddButton = RoutesFromDBComponent.findByType(Route).findByType(StyledButton)
      AddButton.props.onClick()
    })

    it('correctly removes a route from addedRoutes', () => {
      const { addedRoutes } = AppComponent.state
      expect(addedRoutes.length).toBe(0)
    })

    it('changes the color of button back to green', () => {
      const { color } = AddButton.props
      expect(color).toBe('green')
    })
  })
})
