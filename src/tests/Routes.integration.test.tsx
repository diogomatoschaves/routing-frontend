import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import App from '../components/App'
import Map from '../components/Map'
import { formatCoords, getPath } from '../utils/functions'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const mockStart = {
  lat: 53,
  lng: 12
}

const mockEnd = {
  lat: 55,
  lng: 15
}

const urlMatchString = '/:profile/:start/:end'

const getTestApp = (initialEntries: string[] = ['/'], loadedProp: boolean = false) =>
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
                loadedProp={loadedProp}
              />
            )}
          />
        )}
      />
    </MemoryRouter>
  )

describe('App starting with blank URL', () => {
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
})

describe('App starting with invalid URL', () => {
  const testInstance = getTestApp(['/car/kdfj/35'])

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  it('URL defaults to default profile', () => {
    const { profile } = AppComponent.state
    const { location } = AppComponent.props

    expect(profile).toBe('car')

    const splitUrl = location.pathname.split('/')

    expect(splitUrl[1]).toBe('car')
  })
})

describe('App starting with valid URL', () => {
  const mockProfile = 'car'

  const mockUrl = `/${mockProfile}/${formatCoords(mockStart)}/${formatCoords(mockEnd)}`

  const testInstance = getTestApp([mockUrl], true)

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  it('URL stays the same', () => {
    const { location } = AppComponent.props

    expect(location.pathname).toBe(mockUrl)

    const splitUrl = location.pathname.split('/')

    expect(splitUrl).toHaveLength(4)
    expect(splitUrl[2]).toBe(formatCoords(mockStart))
    expect(splitUrl[3]).toBe(formatCoords(mockEnd))
  })

  it('correctly updates the locations and profile', () => {
    const { locations, profile } = AppComponent.state

    expect(profile).toBe(mockProfile)

    expect(locations.length).toBe(2)

    const startPoint = locations.find((el: any) => el.name === 'start')
    const endPoint = locations.find((el: any) => el.name === 'end')

    expect(startPoint.lat).toBe(mockStart.lat)
    expect(startPoint.lng).toBe(mockStart.lng)
    expect(endPoint.lat).toBe(mockEnd.lat)
    expect(endPoint.lng).toBe(mockEnd.lng)
  })

  it('correctly adds markers to the map', () => {
    const { markers } = MapComponent.state

    expect(markers).toHaveLength(2)
  })
})

describe('App starting with valid URL, with foot profile', () => {
  const mockProfile = 'foot'

  const mockUrl = `/${mockProfile}/${formatCoords(mockStart)}/${formatCoords(mockEnd)}`

  const testInstance = getTestApp([mockUrl], true)

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  it('URL stays the same', () => {
    const { location } = AppComponent.props

    expect(location.pathname).toBe(mockUrl)

    const splitUrl = location.pathname.split('/')

    expect(splitUrl).toHaveLength(4)
    expect(splitUrl[2]).toBe(formatCoords(mockStart))
    expect(splitUrl[3]).toBe(formatCoords(mockEnd))
  })

  it('correctly updates the locations and profile', () => {
    const { locations, profile } = AppComponent.state

    expect(profile).toBe(mockProfile)

    expect(locations.length).toBe(2)

    const startPoint = locations.find((el: any) => el.name === 'start')
    const endPoint = locations.find((el: any) => el.name === 'end')

    expect(startPoint.lat).toBe(mockStart.lat)
    expect(startPoint.lng).toBe(mockStart.lng)
    expect(endPoint.lat).toBe(mockEnd.lat)
    expect(endPoint.lng).toBe(mockEnd.lng)
  })
})
