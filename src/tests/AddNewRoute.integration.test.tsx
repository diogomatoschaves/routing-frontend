import React from 'react'
import { MemoryRouter, Route as RouteURL } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { Button, TextArea } from 'semantic-ui-react'
import { fetchRouteDB } from '../apiCalls'
import { mockCarResponse, mockMatchResponse } from '../apiCalls/__mocks__/mockResponse'
import AddDataInput from '../components/AddDataInput'
import App from '../components/App'
import DebugPanel from '../components/DebugPanel'
import Map from '../components/Map'
import Route from '../components/Route'
import RoutesFromDB from '../components/RoutesFromDB'
import { Tab } from '../components/Tabs'
import TextAreaInput from '../components/TextAreaInput'
import { StyledButton } from '../styledComponents'
import StyledInput from '../styledComponents/StyledInput'
import { Coords2, MatchLeg } from '../types'
import { formatCoords } from '../utils/functions'
import { getPath } from '../utils/urlConfig'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const urlMatchString = '/:profile/:start/:end'

const getTestApp = (initialEntries: string[] = ['/'], loadedProp: boolean = false) =>
  TestRenderer.create(
    <MemoryRouter initialEntries={initialEntries}>
      <RouteURL
        render={({ location }) => (
          <RouteURL
            path={getPath(location.pathname)}
            render={({ location: newLocation, history, match }) => (
              <App
                location={newLocation}
                history={history}
                match={match}
                urlMatchString={urlMatchString}
                loadedProp={loadedProp}
              />
            )}
          />
        )}
      />
    </MemoryRouter>
  )

const invalidJson = '{"invalid"}'

const selectTab = (root: any, key: string) => {
  const TabComponent = root.findAllByType(Tab).filter((el: any) => el.props.id === key)[0]
  TabComponent.props.onClick()
}

describe('Behaviour of textarea to add new routes from route response', () => {
  const mockProfile = 'car'
  const mockStart = {
    lat: 53,
    lng: 12
  }
  const mockEnd = {
    lat: 55,
    lng: 15
  }
  const initialState = `/${mockProfile}/${formatCoords(mockStart)}/${formatCoords(
    mockEnd
  )}`

  const testInstance = getTestApp([initialState], true)

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  let TextAreaInputComponent: any
  let TextAreaComponent: any
  let AddDataInputComponent: any
  let ConfirmButton: any
  let addPolylineSpy: any
  let id: string

  it('markers array has 2 markers', () => {
    const { markers } = MapComponent.state
    expect(markers).toHaveLength(2)
  })

  describe('Behaviour when debug mode is selected', () => {
    beforeAll(() => {
      selectTab(root, 'debug')
      TextAreaInputComponent = root
        .findAllByType(TextAreaInput)
        .filter((el: any) => el.props.id === 'route')[0]
    })

    it('textarea color is not red', () => {
      const { color } = TextAreaInputComponent.props
      expect(color).not.toBe('red')
    })

    it('empties markers array', () => {
      const { markers } = MapComponent.state
      expect(markers).toHaveLength(0)
    })
  })

  describe('Route input with invalid JSON', () => {
    beforeAll(() => {
      id = 'route'
      selectTab(root, 'debug')
      TextAreaInputComponent = root
        .findAllByType(TextAreaInput)
        .filter((el: any) => el.props.id === id)[0]
      TextAreaComponent = TextAreaInputComponent.findByType(TextArea)
      AddDataInputComponent = root.findAllByType(AddDataInput)[0]
      ConfirmButton = AddDataInputComponent.findByType(Button)
      addPolylineSpy = jest.spyOn(MapComponent, 'addPolyline')
    })

    describe('Behaviour when input is blurred with invalid JSON', () => {
      beforeAll(() => {
        TextAreaComponent.props.onChange('', { id, value: invalidJson })
        TextAreaComponent.props.onBlur()
      })

      it('updates the color of the textarea to red', done => {
        delay(500).then(() => {
          const { color } = TextAreaInputComponent.props
          expect(color).toBe('red')
          done()
        })
      })
    })

    describe('Behaviour when confirm button is pressed', () => {
      beforeAll(() => {
        ConfirmButton.props.onClick()
      })

      it('does not add a new route', () => {
        const { addedRoutes } = AppComponent.state
        expect(addedRoutes.length).toBe(0)
      })

      it('does not plot a new polyline on the map', () => {
        const { addedRoutesIds } = MapComponent.state
        expect(addedRoutesIds.length).toBe(0)
        expect(addPolylineSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('Route input with valid JSON', () => {
    beforeAll(() => {
      id = 'route'
      selectTab(root, 'debug')
      TextAreaInputComponent = root
        .findAllByType(TextAreaInput)
        .filter((el: any) => el.props.id === id)[0]
      TextAreaComponent = TextAreaInputComponent.findByType(TextArea)
      AddDataInputComponent = root.findAllByType(AddDataInput)[0]
      ConfirmButton = AddDataInputComponent.findByType(Button)
      addPolylineSpy = jest.spyOn(MapComponent, 'addPolyline')
    })

    describe('Behaviour when input is blurred with valid JSON', () => {
      beforeAll(() => {
        TextAreaComponent.props.onChange('', {
          id,
          value: JSON.stringify(mockCarResponse)
        })
        TextAreaComponent.props.onBlur()
      })

      it('does not update the color of the textarea to red', done => {
        delay(500).then(() => {
          const { color } = TextAreaInputComponent.props
          expect(color).not.toBe('red')
          done()
        })
      })
    })

    describe('Behaviour when confirm button is pressed', () => {
      beforeAll(() => {
        ConfirmButton.props.onClick()
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
        expect(addPolylineSpy).toHaveBeenCalledTimes(1)
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
        TextAreaComponent.props.onChange('', {
          id,
          value: JSON.stringify(mockCarResponse)
        })
        TextAreaComponent.props.onBlur()
        ConfirmButton.props.onClick()
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
        expect(addPolylineSpy).toHaveBeenCalledTimes(2)
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

describe('Behaviour of textarea to add new routes from match response', () => {
  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  let TextAreaInputComponent: any
  let TextAreaComponent: any
  let AddDataInputComponent: any
  let ConfirmButton: any
  let addPolylineSpy: any
  let id: string

  describe('Match input with invalid JSON', () => {
    beforeAll(() => {
      id = 'match'
      selectTab(root, 'debug')
      selectTab(root, id)
      TextAreaInputComponent = root
        .findAllByType(TextAreaInput)
        .filter((el: any) => el.props.id === id)[0]
      TextAreaComponent = TextAreaInputComponent.findByType(TextArea)
      AddDataInputComponent = root.findAllByType(AddDataInput)[0]
      ConfirmButton = AddDataInputComponent.findByType(Button)
      addPolylineSpy = jest.spyOn(MapComponent, 'addPolyline')
    })

    describe('Behaviour when input is blurred with invalid JSON', () => {
      beforeAll(() => {
        TextAreaComponent.props.onChange('', { id, value: invalidJson })
        TextAreaComponent.props.onBlur()
      })

      it('updates the color of the textarea to red', done => {
        delay(500).then(() => {
          const { color } = TextAreaInputComponent.props
          expect(color).toBe('red')
          done()
        })
      })
    })

    describe('Behaviour when confirm button is pressed', () => {
      beforeAll(() => {
        ConfirmButton.props.onClick()
      })

      it('does not add a new route', () => {
        const { addedRoutes } = AppComponent.state
        expect(addedRoutes.length).toBe(0)
      })

      it('does not plot a new polyline on the map', () => {
        const { addedRoutesIds } = MapComponent.state
        expect(addedRoutesIds.length).toBe(0)
        expect(addPolylineSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('Match input with valid JSON', () => {
    beforeAll(() => {
      id = 'match'
      selectTab(root, 'debug')
      selectTab(root, id)
      TextAreaInputComponent = root
        .findAllByType(TextAreaInput)
        .filter((el: any) => el.props.id === id)[0]
      TextAreaComponent = TextAreaInputComponent.findByType(TextArea)
      AddDataInputComponent = root.findAllByType(AddDataInput)[0]
      ConfirmButton = AddDataInputComponent.findByType(Button)
      addPolylineSpy = jest.spyOn(MapComponent, 'addPolyline')
    })

    describe('Behaviour when input is blurred with valid JSON', () => {
      beforeAll(() => {
        TextAreaComponent.props.onChange('', {
          id,
          value: JSON.stringify(mockMatchResponse)
        })
        TextAreaComponent.props.onBlur()
      })

      it('does not update the color of the textarea to red', done => {
        delay(500).then(() => {
          const { color } = TextAreaInputComponent.props
          expect(color).not.toBe('red')
          done()
        })
      })
    })

    describe('Behaviour when confirm button is pressed', () => {
      beforeAll(() => {
        ConfirmButton.props.onClick()
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
        const routePath = mockMatchResponse.matchings[0].legs.reduce(
          (accum: Coords2[], leg: MatchLeg) => [
            ...accum,
            ...(leg.geometry ? leg.geometry : [])
          ],
          []
        )
        expect(addPolylineSpy).toHaveBeenCalledTimes(1)
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
        TextAreaComponent.props.onChange('', {
          id,
          value: JSON.stringify(mockMatchResponse)
        })
        TextAreaComponent.props.onBlur()
        ConfirmButton.props.onClick()
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
        const routePath = mockMatchResponse.matchings[0].legs.reduce(
          (accum: Coords2[], leg: MatchLeg) => [
            ...accum,
            ...(leg.geometry ? leg.geometry : [])
          ],
          []
        )
        expect(addPolylineSpy).toHaveBeenCalledTimes(2)
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

    it('correctly calls the fetch route from db endpoint', done => {
      delay(500).then(() => {
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

    it('correctly calls the fetch route from db endpoint', done => {
      delay(500).then(() => {
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
