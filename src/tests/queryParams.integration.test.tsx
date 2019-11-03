import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import App from '../components/App'
import {
  getPath,
  OptionalParams,
  optionalParamsMapping,
  urlMatchString
} from '../utils/urlConfig'
import { Checkbox } from 'semantic-ui-react'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

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

const convertQueryParamsToString = (queryParams: OptionalParams) => {
  return Object.entries(queryParams)
    .reduce((str: string, param: any) => {
      return `${str}${param[0]}=${String(param[1])}&`
    }, '?')
    .slice(0, -1)
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

describe('App starting with blank URL', () => {
  const queryParams = {
    coveredAreas: false,
    google: false,
    routingGraph: false,
    traffic: false
  }

  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  it('Url updates to the right default url', () => {
    const { profile } = AppComponent.state
    const { location } = AppComponent.props

    const paramsUrl = `/${profile}/-;-/develop`
    const queryParamsUrl = convertQueryParamsToString(queryParams)

    const fullUrl = location.pathname + location.search

    expect(fullUrl).toBe(paramsUrl + queryParamsUrl)
  })
})

describe('App starting with some query params', () => {
  const queryParams: OptionalParams = {
    coveredAreas: true,
    traffic: true
  }

  const initialParamsUrl = '/foot/-;-/develop'
  const initialQueryParamsUrl = convertQueryParamsToString(queryParams)

  const initialUrl = initialParamsUrl + initialQueryParamsUrl

  const testInstance = getTestApp([initialUrl])

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  it('URL updates to default params url', () => {
    const { profile } = AppComponent.state
    const { location } = AppComponent.props

    const allQueryParams: OptionalParams = {
      coveredAreas: queryParams.coveredAreas,
      google: false,
      routingGraph: false,
      traffic: queryParams.traffic
    }

    const paramsUrl = `/${profile}/-;-/develop`
    const queryParamsUrl = convertQueryParamsToString(allQueryParams)

    const fullUrl = location.pathname + location.search

    expect(fullUrl).toBe(paramsUrl + queryParamsUrl)
  })

  it('Updates the App settings to its right values', () => {
    const allQueryParams: OptionalParams = {
      coveredAreas: queryParams.coveredAreas,
      google: false,
      routingGraph: false,
      traffic: queryParams.traffic
    }

    Object.entries(optionalParamsMapping).forEach((entry: any) => {
      const { [entry[1]]: prop } = AppComponent.state
      expect(prop).toBe(allQueryParams[entry[0]])
    })
  })
})

describe('App starting with all query params defined', () => {
  const queryParams: OptionalParams = {
    coveredAreas: true,
    google: true,
    routingGraph: true,
    traffic: true
  }

  const initialParamsUrl = '/'
  const initialQueryParamsUrl = convertQueryParamsToString(queryParams)

  const initialUrl = initialParamsUrl + initialQueryParamsUrl

  const testInstance = getTestApp([initialUrl])

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  it('URL updates to default params url', () => {
    const { profile } = AppComponent.state
    const { location } = AppComponent.props

    const paramsUrl = `/${profile}/-;-/develop`
    const queryParamsUrl = convertQueryParamsToString(queryParams)

    const fullUrl = location.pathname + location.search

    expect(fullUrl).toBe(paramsUrl + queryParamsUrl)
  })

  it('Updates the App settings to its right values', () => {
    Object.entries(optionalParamsMapping).forEach((entry: any) => {
      const { [entry[1]]: prop } = AppComponent.state
      expect(prop).toBe(queryParams[entry[0]])
    })
  })
})

describe('When google maps option is selected', () => {

  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance

  beforeAll(() => {
    toggle(
      root,
      {
        id: 'googleMapsOption',
        text: 'Google'
      },
      true
    )
  })

  it('URL updates correspondingly', () => {
    const { profile } = AppComponent.state
    const { location } = AppComponent.props

    const queryParams: OptionalParams = {
      coveredAreas: false,
      google: true,
      routingGraph: false,
      traffic: false
    }

    const paramsUrl = `/${profile}/-;-/develop`
    const queryParamsUrl = convertQueryParamsToString(queryParams)

    const fullUrl = location.pathname + location.search

    expect(fullUrl).toBe(paramsUrl + queryParamsUrl)
  })
})