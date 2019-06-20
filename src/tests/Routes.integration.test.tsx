import React from 'react'
import TestRenderer from 'react-test-renderer'
import App from '../components/App'
import { MemoryRouter, Route } from 'react-router-dom'
import { formatCoords, getPath } from '../utils/functions'


jest.mock('../apiCalls');

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
});

const mockStart = {
  lat: 53,
  lng: 12
}

const mockEnd = {
  lat: 55,
  lng: 15
}

const urlMatchString = '/:profile/:start/:end'

describe('App starting with blank URL', () => {

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/' ]}>
      <Route render={({ location }) => (
        <Route path={getPath(location.pathname)} render={({ location, history, match }) => (
          <App location={location} history={history} match={match} urlMatchString={urlMatchString}/>
        )}/>
      )}/>
    </MemoryRouter>
  )

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

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[ '/car/kdfj/35' ]}>
      <Route render={({ location }) => (
        <Route path={getPath(location.pathname)} render={({ location, history, match }) => (
          <App location={location} history={history} match={match} urlMatchString={urlMatchString}/>
        )}/>
      )}/>
    </MemoryRouter>
  )

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

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[mockUrl]}>
      <Route render={({ location }) => (
        <Route path={getPath(location.pathname)} render={({ location, history, match }) => (
          <App 
            location={location} 
            history={history} 
            match={match} 
            urlMatchString={urlMatchString}
            loadedProp={true}
          />
        )}/>
      )}/>
    </MemoryRouter>
  )

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

    expect(locations.length).toBe(2);
    
    const startPoint = locations.find((el: any) => el.name === 'start')
    const endPoint = locations.find((el: any) => el.name === 'end')

    expect(startPoint.lat).toBe(mockStart.lat);
    expect(startPoint.lng).toBe(mockStart.lng);
    expect(endPoint.lat).toBe(mockEnd.lat);
    expect(endPoint.lng).toBe(mockEnd.lng);
  })
})

describe('App starting with valid URL, with foot profile', () => {

  const mockProfile = 'foot'

  const mockUrl = `/${mockProfile}/${formatCoords(mockStart)}/${formatCoords(mockEnd)}`

  const testInstance = TestRenderer.create(
    <MemoryRouter initialEntries={[mockUrl]}>
      <Route render={({ location }) => (
        <Route path={getPath(location.pathname)} render={({ location, history, match }) => (
          <App 
            location={location} 
            history={history} 
            match={match} 
            urlMatchString={urlMatchString}
            loadedProp={true}
          />
        )}/>
      )}/>
    </MemoryRouter>
  )

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

    expect(locations.length).toBe(2);
    
    const startPoint = locations.find((el: any) => el.name === 'start')
    const endPoint = locations.find((el: any) => el.name === 'end')

    expect(startPoint.lat).toBe(mockStart.lat);
    expect(startPoint.lng).toBe(mockStart.lng);
    expect(endPoint.lat).toBe(mockEnd.lat);
    expect(endPoint.lng).toBe(mockEnd.lng);
  })
})

