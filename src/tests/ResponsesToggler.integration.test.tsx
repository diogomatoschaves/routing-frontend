
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { mockCarResponse, mockCarTrafficResponse } from '../apiCalls/__mocks__/mockResponse'
import mockGoogleResponse from '../apiCalls/__mocks__/mockGoogleResponse'
import App from '../components/App'
import Map from '../components/Map'
import InspectPanel from '../components/InspectPanel'
import { MemoryRouter, Route } from 'react-router-dom'
import { getPath, formatCoords } from '../utils/functions'
import { Box } from '../styledComponents';
import { Checkbox } from 'semantic-ui-react';

jest.mock('../apiCalls')

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const mockEventStart = { lng: 13.389869, lat: 52.510348 }
const mockEventEnd = { lng: 13.39114, lat: 52.510425 }

const urlMatchString = '/:profile/:start/:end'

const toggle = (root: any, togglerProps: { text: string, id: string }, checked: boolean) => {
  const Toggler = root.findAllByType(Checkbox).filter((el: any) => {
    return el.props.id === togglerProps.id
  })[0]

  Toggler.props.onChange('', { checked })
}

const selectNext = (root: any) => {
  const NextProfile = root.findAllByType(Box).filter((el: any) => {
    return el.props.right
  })[0]

  NextProfile.props.onClick()
}

const getTestApp = (initialEntries: Array<string> = ['/']) => TestRenderer.create(
  <MemoryRouter initialEntries={initialEntries}>
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

describe('Behaviour of Responses Toggler', () => {

  const mockProfile = 'car'

  const testInstance = getTestApp([`/${mockProfile}/${formatCoords(mockEventStart)}/${formatCoords(mockEventEnd)}`])

  const root = testInstance.root

  const AppComponent = root.findByType(App).instance
  const MapComponent = root.findByType(Map).instance

  const InspectPanelComponent = root.findByType(InspectPanel)

  describe('Initial state', () => {
    beforeAll(() => {
      toggle(root, {
        text: 'Traffic',
        id: 'trafficOption'
      }, true)
    
      toggle(root, {
        text: 'Compare 3rd Party',
        id: 'googleMapsOption'
      }, true)  
    })

    it('Default response is routing service without traffic', () => {
      const { response } = InspectPanelComponent.props
      
      const duration = response.routes[0].totalDuration
      const mockDuration = mockCarResponse.routes[0].totalDuration

      expect(duration).toBe(mockDuration)
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



