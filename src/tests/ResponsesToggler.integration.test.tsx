import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { Checkbox } from 'semantic-ui-react'
import mockGoogleResponse from '../apiCalls/__mocks__/mockGoogleResponse'
import { mockCarResponse, mockCarTrafficResponse } from '../apiCalls/__mocks__/mockResponse'
import App from '../components/App'
import InspectPanel from '../components/InspectPanel'
import Map from '../components/Map'
import { Box } from '../styledComponents'
import { formatCoords } from '../utils/functions'
import { getPath, urlMatchString } from '../utils/urlConfig'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const mockEventStart = { lon: 13.389869, lat: 52.510348 }
const mockEventEnd = { lon: 13.39114, lat: 52.510425 }

const selectNext = (root: any) => {
  const NextProfile = root.findAllByType(Box).filter((el: any) => {
    return el.props.right
  })[0]

  NextProfile.props.onClick()
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

describe('Behaviour of Responses Toggler', () => {
  const mockProfile = 'car'

  const queryParams = {
    google: true,
    traffic: true
  }

  const queryParamsString = Object.entries(queryParams)
    .reduce((str: string, param: any) => {
      return `${str}${param[0]}=${String(param[1])}&`
    }, '?')
    .slice(0, -1)

  const testInstance = getTestApp([
    `/${mockProfile}/${formatCoords(mockEventStart)};${formatCoords(mockEventEnd)}` +
      queryParamsString
  ])

  const root = testInstance.root

  const InspectPanelComponent = root.findByType(InspectPanel)

  describe('Initial state', () => {
    delay(500).then(() => {
      it('Default response is routing service without traffic', done => {
        const { response } = InspectPanelComponent.props

        const duration = response.routes[0].totalDuration
        const mockDuration = mockCarResponse.routes[0].totalDuration

        expect(duration).toBe(mockDuration)
        done()
      })
    })
  })

  describe('Behaviour when next button is pressed', () => {
    beforeAll(() => {
      selectNext(root)
    })

    it('updates the response to the trafficResponse', () => {
      const { response } = InspectPanelComponent.props

      const duration = response.routes[0].totalDuration
      const mockDuration = mockCarTrafficResponse.routes[0].totalDuration

      expect(duration).toBe(mockDuration)
    })
  })

  describe('Behaviour when input is updated with valid JSON', () => {
    beforeAll(() => {
      selectNext(root)
    })

    it('updates the response to the trafficResponse', () => {
      const { response } = InspectPanelComponent.props

      expect(response.status).toBe(mockGoogleResponse.status)
    })
  })
})
