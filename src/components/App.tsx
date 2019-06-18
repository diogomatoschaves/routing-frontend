import React, { Component } from 'react'
import styled from 'styled-components'
import Map from './Map'
import Panel from './Panel'
import RouteInfo from './RouteInfo'
import TrafficLegend from './TrafficLegend'
import '../App.css'
import { UpdatePoint, UpdateState, Location, Response, Coords2, Geography, Route } from '../types'
import { defaultResponse } from '../utils/input'
import { Base64 } from 'js-base64';
import { routingApi, googleDirections } from '../apiCalls'
import { 
  POLYLINE_COLOR, 
  ROUTING_SERVICE,
  ROUTING_SERVICE_STATS,
  THIRD_PARTY_COLOR, 
  THIRD_PARTY_POLYLINE, 
  THIRD_PARTY_STATS, 
} from '../utils/colours';


const AppWrapper: any = styled.div`
  width: 100vw;
  height: 100vh;
`

interface State {
  locations: Array<Location>,
  authorization: string,
  response: Response,
  routePath?: Array<Coords2>,
  duration: number
  distance: number,
  message?: string | null
  googleMessage?: string | null
  routingGraphVisible?: boolean,
  polygonsVisible?: boolean,
  geography: Geography,
  recenter: boolean,
  profile: string,
  google?: any,
  googleRoute?: Route | null
}

declare global {
  interface Window { 
    google: any; 
  }
}


class App extends Component<any, State> {

  static defaultProps = {
    geographies: [{
      name: 'Berlin',
      coords: [13.38408, 52.51721],
      polygon: 'berlin.geojson'
    }, {
      name: 'Stuttgart',
      coords: [9.033, 48.7111],
      polygon: 'stuttgart.geojson'
    }, {
      name: 'Immendingen',
      coords: [8.7214, 47.912],
      polygon: 'immendingen.geojson'
    }, {
      name: 'San José',
      coords: [-121.97588, 37.34606],
      polygon: 'sunnyvale.geojson'
    }]
  }

  state = {
    google: null,
    googleRoute: null,
    routingGraphVisible: false,
    polygonsVisible: false,
    googleMapsOption: false,
    profile: 'car',
    geography: {
      name: 'Berlin',
      coords: [13.38408, 52.51721],
      polygon: 'berlin.geojson'
    },
    recenter: false,
    authorization: '',
    routePath: [],
    duration: 0,
    distance: 0,
    response: defaultResponse,
    locations: [{ 
      name: 'start', 
      marker: 'map marker alternate',
      markerOffset: [0, 5],
      placeholder: 'Origin',
      lat: null,
      lng: null
    }, { 
      name: 'end', 
      marker: 'map marker',
      markerOffset: [0, 5],
      placeholder: 'Destination',
      lat: null,
      lng: null
    }]
  }

  componentDidMount() {

    const { windowProp } = this.props

    const username = process.env.REACT_APP_LDAP_USERNAME
    const password = process.env.REACT_APP_LDAP_PASSWORD

    const authorization = `Basic ${Base64.encode(`${username}:${password}`)}`

    this.addGoogleObject(windowProp)

    this.setState({ authorization })
  }

  componentDidUpdate(prevProps: any, prevState: State) {

    const { locations, authorization, response, profile, googleMapsOption, google } = this.state

    if (prevState.locations !== locations || prevState.profile !== profile) {
      this.getRoute(locations, profile, authorization, googleMapsOption, google)
    }

    if (prevState.response !== response) {
      if (Object.keys(response).includes('code') && response.code == 'Ok') {
        const leg = response.routes[0].legs[0]
        const routePath = leg.geometry
        const duration = leg.duration
        const distance = leg.distance
        this.setState({ routePath, duration, distance })
      }
    }
  }

  getRoute = (locations: Array<Location>, profile: string, authorization: string, googleMapsOption: boolean, google: any) => {
    if (locations.length >= 2 && !locations.some((el: Location) => (!el.lat || !el.lng))) {
      routingApi(profile, authorization, locations)
      .then((response: Response) => this.setState({ response }))
      .catch(() => this.setState({ message: 'There was an error fetching the route. Try again later' }))

      if (googleMapsOption && google) {
        googleDirections(google, profile, locations)
        .then((googleRoute: Route) => this.setState({ googleRoute }))
        .catch(() => this.setState({ googleMessage: 'There was an error fetching the google route. Try again later' }))
      }
    }
  }

  addGoogleObject = (windowProp: boolean) => {

    if (!windowProp && !window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.google.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_TOKEN}`;
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(script);
      
      script.addEventListener('load', e => {
        console.log('google was loaded')
        this.setState({ google: window.google })
      })
    } else {
      this.setState({ google: window.google || windowProp})
    }
  }

  updatePoint: UpdatePoint = (index, coords) => {
    this.setState((state) => {
      return {
        locations: state.locations.reduce((accum: Array<Location>, element: Location, currentIndex: number) => {
          return index !== currentIndex ? 
            [...accum, element] : 
            [...accum, { 
              ...element,
              lat: coords.lat,
              lng: coords.lng
            }]
        }, [])
      }
    })
  }

  updateState: UpdateState = (stateKey: string, value: any) => {
    this.setState(prevState => ({ 
      ...prevState,
      [stateKey]: value 
    }))
  }

  public render() {

    const { locations, routePath, duration, distance, routingGraphVisible, googleMapsOption,
      polygonsVisible, geography, recenter, profile, authorization, googleRoute } = this.state
    const { geographies } = this.props

    return (
      <AppWrapper>
        {duration && (
          <RouteInfo
            statsColor={ROUTING_SERVICE_STATS}
            textColor={ROUTING_SERVICE}
            iconColor={POLYLINE_COLOR}
            title={'Routing Service'}
            route={{ distance, duration }}
            top={'40px'}
            right={'40px'}
          />
        )}
        {googleRoute && (
          <RouteInfo
            statsColor={THIRD_PARTY_STATS}
            textColor={THIRD_PARTY_COLOR}
            iconColor={THIRD_PARTY_POLYLINE}
            title={'Google Maps'}
            route={googleRoute}
            top={'270px'} 
            right={'40px'}
        />)}
        <Panel 
          locations={locations}
          updatePoint={this.updatePoint}
          updateState={this.updateState}
          routingGraphVisible={routingGraphVisible}
          polygonsVisible={polygonsVisible}
          googleMapsOption={googleMapsOption}
          geography={geography}
          geographies={geographies}
          profile={profile}
          googleRoute={googleRoute}
        />
        <Map 
          locations={locations}
          updatePoint={this.updatePoint}
          updateState={this.updateState}
          routePath={routePath}
          routingGraphVisible={routingGraphVisible}
          polygonsVisible={polygonsVisible}
          googleMapsOption={googleMapsOption}
          geography={geography}
          geographies={geographies}
          recenter={recenter}
          authorization={authorization}
          googleRoute={googleRoute}
        />
        {routingGraphVisible && <TrafficLegend />}
      </AppWrapper>
    )
  }
}

export default App
