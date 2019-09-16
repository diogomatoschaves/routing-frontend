
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { mockCarResponse } from '../apiCalls/__mocks__/mockResponse'
import App from '../components/App'
import Map from '../components/Map'
import InspectPanel from '../components/InspectPanel'
import { Tab } from '../components/Tabs'
import { MemoryRouter, Route } from 'react-router-dom'
import { getPath, formatCoords } from '../utils/functions'
import TextAreaInput from '../components/TextAreaInput';
import { TextArea, Button } from 'semantic-ui-react';
import EditDataInput from '../components/EditDataInput';

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

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
    },
  ],
  reportGeometry: true,
}

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

describe('Behaviour of Changing Body raw data', () => {

  const testInstance = getTestApp()

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  const InspectPanelComponent = root.findByType(InspectPanel)
  

  const TextAreaInputComponent = root.findAllByType(TextAreaInput).filter(el => el.props.id === 'body')[0]
  const TextAreaComponent = TextAreaInputComponent.findByType(TextArea)

  const EditDataInputComponent = root.findAllByType(EditDataInput).filter(el => el.props.id === 'body')[0]
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
      delay(500)
      .then(() => {
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

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')
      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(endPoint.lat).toBe(null);
      expect(endPoint.lng).toBe(null);
      expect(startPoint.lat).toBe(null);
      expect(startPoint.lng).toBe(null);
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
      delay(500)
      .then(() => {
        const { bodyColor } = InspectPanelComponent.props
        expect(bodyColor).not.toBe('red')
        done()
      })
    })
  })

  describe('Behaviour when input confirm button is pressed with valid JSON', () => {

    beforeAll(() => {
      TextAreaComponent.props.onChange('', { id: 'body', value: JSON.stringify(mockBody) })
      TextAreaComponent.props.onBlur()
      ConfirmButton.props.onClick()
    })
    
    it('does update the locations array with the corresponding value', () => {
      const { locations } = MapComponent.props

      expect(locations.length).toBe(2);

      const startPoint = locations.find((el: any) => el.name === 'start')
      const endPoint = locations.find((el: any) => el.name === 'end')

      expect(startPoint.lat).toBe(mockEventStart.lat);
      expect(startPoint.lng).toBe(mockEventStart.lng);
      expect(endPoint.lat).toBe(mockEventEnd.lat);
      expect(endPoint.lng).toBe(mockEventEnd.lng);
    })

    it('inserts a marker on the Map component', () => {
      const { markers } = MapComponent.state

      expect(markers.length).toBe(2)
    })

    it('correctly updates the Url', () => {
      const { location } = AppComponent.props

      const splitUrl = location.pathname.split('/')

      expect(splitUrl).toHaveLength(4)
      expect(splitUrl[2]).toBe(formatCoords(mockEventStart))
      expect(splitUrl[3]).toBe(formatCoords(mockEventEnd))
    })
  })
})



