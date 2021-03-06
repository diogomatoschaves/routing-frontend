import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import { Button, TextArea } from 'semantic-ui-react'
import App from '../components/App'
import EditDataInput from '../components/EditDataInput'
import InspectPanel from '../components/InspectPanel'
import Map from '../components/Map'
import { Tab } from '../components/Tabs'
import TextAreaInput from '../components/TextAreaInput'
import { formatCoords } from '../utils/functions'
import { getPath, matchingParams, urlMatchString } from '../utils/urlConfig'

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const mockEventStart = { lon: 13.389869, lat: 52.510348 }
const mockEventEnd = { lon: 13.39114, lat: 52.510425 }

const mockBody = {
  locations: [
    {
      lat: mockEventStart.lat,
      lon: mockEventStart.lon
    },
    {
      lat: mockEventEnd.lat,
      lon: mockEventEnd.lon
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

const toggleDebug = (root: any) => {
  const TabComponent = root
    .findAllByType(Tab)
    .filter((el: any) => el.props.id === 'debug')[0]
  TabComponent.props.onClick()
}

describe('Behaviour of Changing Body raw data', () => {
  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  const InspectPanelComponent = root.findByType(InspectPanel)

  const TextAreaInputComponent = root
    .findAllByType(TextAreaInput)
    .filter(el => el.props.id === 'body')[0]
  const TextAreaComponent = TextAreaInputComponent.findByType(TextArea)

  const EditDataInputComponent = root
    .findAllByType(EditDataInput)
    .filter(el => el.props.id === 'body')[0]
  const ConfirmButton = EditDataInputComponent.findByType(Button)

  it('the color of the textarea is not red', () => {
    const { color } = TextAreaInputComponent.props
    expect(color).not.toBe('red')
  })

  describe('Behaviour when input is updated with invalid JSON', () => {
    beforeAll(() => {
      TextAreaComponent.props.onChange('', { id: 'body', value: invalidJson })
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

  describe('Behaviour when input confirm button is pressed with invalid JSON', () => {
    beforeAll(() => {
      ConfirmButton.props.onClick()
    })

    it('does not update the locations array', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2)

      const startPoint = locations.find((el: any) => el.name === 'start')
      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(null)
      expect(endPoint.lon).toBe(null)
      expect(startPoint.lat).toBe(null)
      expect(startPoint.lon).toBe(null)
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

  describe('Behaviour when input is updated with valid JSON', () => {
    beforeAll(() => {
      AppComponent.handleValueUpdate({ id: 'bodyValue', value: JSON.stringify(mockBody) })
    })

    it('does not update the color of the textarea to red', done => {
      delay(500).then(() => {
        const { bodyColor } = InspectPanelComponent.props
        expect(bodyColor).not.toBe('red')
        done()
      })
    })
  })

  describe('Behaviour when input confirm button is pressed with valid JSON', () => {
    beforeAll(() => {
      TextAreaComponent.props.onChange('', {
        id: 'body',
        value: JSON.stringify(mockBody)
      })
      TextAreaComponent.props.onBlur()
      ConfirmButton.props.onClick()
    })

    it('does update the locations array with the corresponding value', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2)

      const startPoint = locations.find((el: any) => el.name === 'start')
      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(startPoint.lat).toBe(mockEventStart.lat)
      expect(startPoint.lon).toBe(mockEventStart.lon)
      expect(endPoint.lat).toBe(mockEventEnd.lat)
      expect(endPoint.lon).toBe(mockEventEnd.lon)
    })

    it('inserts a marker on the Map component', () => {
      const { markers } = MapComponent.state

      expect(markers.length).toBe(2)
    })

    it('correctly updates the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(matchingParams.length + 1)
      expect(splitUrl[2]).toBe(
        `${formatCoords(mockEventStart)};${formatCoords(mockEventEnd)}`
      )
    })
  })
})
