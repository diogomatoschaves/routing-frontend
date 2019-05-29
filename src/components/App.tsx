import React, { Component } from 'react'
import styled from 'styled-components'
import Map from './Map'
import Panel from './Panel'
import RouteInfo from './RouteInfo'
import TrafficLegend from './TrafficLegend'
import '../App.css'
import { UpdatePoint, UpdateState, Location, Response, Coords2, Geography } from '../types'
import { defaultResponse } from '../utils/input'
import { Base64 } from 'js-base64';
import { routingApi } from '../apiCalls'

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
  routingGraphVisible?: boolean,
  polygonsVisible?: boolean,
  geography: Geography,
  recenter: boolean,
  profile: string
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
    routingGraphVisible: false,
    polygonsVisible: false,
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
    const username = process.env.REACT_APP_LDAP_USERNAME
    const password = process.env.REACT_APP_LDAP_PASSWORD

    const authorization = `Basic ${Base64.encode(`${username}:${password}`)}`

    this.setState({ authorization })
  }

  componentDidUpdate(prevProps: any, prevState: State) {

    const { locations, authorization, response, profile } = this.state

    if (prevState.locations !== locations || prevState.profile !== profile) {
      this.getRoute(locations, profile, authorization)
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

  getRoute = (locations: Array<Location>, profile: string, authorization: string) => {
    if (locations.length >= 2 && !locations.some((el: Location) => (!el.lat || !el.lng))) {
      routingApi(profile, authorization, locations)
      .then((response: Response) => this.setState({ response }))
      .catch(() => this.setState({ message: 'There was an error fetching the route. Try again later' }))
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

    const { locations, routePath, duration, distance, routingGraphVisible, 
      polygonsVisible, geography, recenter, profile, authorization } = this.state
    const { geographies } = this.props

    return (
      <AppWrapper>
        {duration && <RouteInfo duration={duration} distance={distance} />}
        <Panel 
          locations={locations}
          updatePoint={this.updatePoint}
          updateState={this.updateState}
          routingGraphVisible={routingGraphVisible}
          polygonsVisible={polygonsVisible}
          geography={geography}
          geographies={geographies}
          profile={profile}
        />
        <Map 
          locations={locations}
          updatePoint={this.updatePoint}
          updateState={this.updateState}
          routePath={routePath}
          routingGraphVisible={routingGraphVisible}
          polygonsVisible={polygonsVisible}
          geography={geography}
          geographies={geographies}
          recenter={recenter}
          authorization={authorization}
        />
        {routingGraphVisible && <TrafficLegend />}
      </AppWrapper>
    )
  }
}

export default App
