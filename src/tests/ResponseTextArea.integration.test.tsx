import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { mockCarResponse } from '../apiCalls/__mocks__/mockResponse'
import App from '../components/App'
import InspectPanel from '../components/InspectPanel'
import Map from '../components/Map'
import { formatCoords } from '../utils/functions'
import { getPath, urlMatchString } from '../utils/urlConfig'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

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
    }
  ],
  reportGeometry: true
}

const getTestApp = (initialEntries: string[] = ['/']) =>
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
              />
            )}
          />
        )}
      />
    </MemoryRouter>
  )

const invalidJson = '{"invalid"}'

describe('Behaviour of Changing Body raw data', () => {
  const mockProfile = 'car'

  const testInstance = getTestApp([
    `/${mockProfile}/${formatCoords(mockEventStart)}/${formatCoords(mockEventEnd)}`
  ])

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  const InspectPanelComponent = root.findByType(InspectPanel)

  const { responseValue: initialResponseValue } = InspectPanelComponent.props

  describe('Behaviour when input is updated with invalid JSON', () => {
    beforeAll(() => {
      AppComponent.handleValueUpdate({ id: 'responseValue', value: invalidJson })
    })

    it('does not update the response Value', done => {
      delay(500).then(() => {
        const { responseValue } = InspectPanelComponent.props
        expect(responseValue).toBe(initialResponseValue)
        done()
      })
    })
  })

  describe('Behaviour when input is updated with valid JSON', () => {
    beforeAll(() => {
      AppComponent.handleValueUpdate({
        id: 'bodyValue',
        value: JSON.stringify(mockCarResponse)
      })
    })

    it('does not update the response Value', done => {
      delay(500).then(() => {
        const { responseValue } = InspectPanelComponent.props
        expect(responseValue).toBe(initialResponseValue)
        done()
      })
    })
  })
})
