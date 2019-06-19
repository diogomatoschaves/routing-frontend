import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { matchPath, generatePath } from "react-router-dom";
import { Menu, Segment, Sidebar } from 'semantic-ui-react';
import Map from './Map'
import Panel from './Panel'
import RouteInfo from './RouteInfo'
import TrafficLegend from './TrafficLegend'
import RawResponse from './RawResponse'
import '../App.css'
import { UpdatePoint, UpdateState, Location, Response, Coords2, Geography, Body } from '../types'
import { defaultResponse } from '../utils/input'
import { splitCoords, getRequestBody, formatCoords } from '../utils/functions'
import { Base64 } from 'js-base64';
import { routingApi } from '../apiCalls'


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
  profile: string,
  visible: boolean,
  body?: Body | undefined,
  mapLoaded: boolean,
  initialUpdate: boolean
}

const AppWrapper: any = styled.div`
  width: 100vw;
  height: 100vh;
`

const StyledSegment = styled(Segment)`
  & > .ui.left.visible.sidebar {
    border: none;
    box-shadow: 10px 10px 16px -9px rgba(77,77,77,0.5);
    width: calc(32%);
    min-width: 500px;
    max-width: 600px;
    transform: none;
  }
`

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
    }],
    urlParams: {
      matching: ['', '/:profile', '/:start', '/:end'],
      requiredParams: {
        profile: 'profile', 
        start: 'start', 
        end: 'end'
      },
      acceptableProfiles: ['car', 'foot']
    },
    endpoint: 'https://routing.develop.otonomousmobility.com'
  }

  state = {
    initialUpdate: false,
    body: undefined,
    mapLoaded: false,
    visible: false,
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

  getProfileLocations = (locations: Array<Location>, params: any, requiredParams: any) => {
    return {
      locations: locations.map((item: Location) => ({
        ...item,
        ...splitCoords(params[requiredParams[item.name]])
      })),
      profile: params[requiredParams.profile]
    }
  }

  componentDidMount() {
    const username = process.env.REACT_APP_LDAP_USERNAME
    const password = process.env.REACT_APP_LDAP_PASSWORD

    const authorization = `Basic ${Base64.encode(`${username}:${password}`)}`

    this.setState({ authorization })

    const { history, match, loadedProp } = this.props
    const { requiredParams, acceptableProfiles } = this.props.urlParams
    const { locations } = this.state

    const params = Object.keys(match.params)

    if (params.length === 3 && params.every((el: string) => {
      return (([requiredParams.start, requiredParams.end].includes(el) && Boolean(splitCoords(match.params[el]))) || 
        (el === requiredParams.profile && acceptableProfiles.includes(match.params[el])))
    })) {

    this.waitTillLoaded(loadedProp)
      .then(() => {
        this.setState(this.getProfileLocations(locations, match.params, requiredParams))
      })
    } else {
      const { profile } = this.state
      const path = generatePath('/:profile', { profile })
      history.push(path)
    }
  }

  componentDidUpdate(prevProps: any, prevState: State) {

    const { locations, authorization, response, profile } = this.state
    const { match, urlMatchString, history } = this.props
    const { requiredParams } = this.props.urlParams

    if (prevState.locations !== locations || prevState.profile !== profile) {
      const path = generatePath(urlMatchString, {
        ...locations.reduce((accum, item) => {
          return {
            ...accum,
            [item.name]: item.lat && item.lng ? formatCoords({ lat: item.lat, lng: item.lng }) : '-'
          }
        }, {}),
        profile
      })

      history.push(path)
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

    // TODO: Check if there is a callback for back and forward buttons
    if (prevProps.match.params !== match.params && Object.keys(match.params).length === 3) {
      const { locations: urlLocations, profile: urlProfile } = 
        this.getProfileLocations(locations, match.params, requiredParams)
      this.getRoute(urlLocations, urlProfile, authorization)
    }
  }

  waitTillLoaded = (loadedProp: boolean) => {

    if (loadedProp) return Promise.resolve(loadedProp)

    return new Promise((resolve) => {
      const timeoutCallback = () => {
        i++
        const { mapLoaded } = this.state

        if (mapLoaded) resolve(mapLoaded)
        else setTimeout(timeoutCallback, i * 300)
      }

      let i = 0
      setTimeout(timeoutCallback, i * 300)
    })
  }

  getRoute = (locations: Array<Location>, profile: string, authorization: string) => {
    if (locations.length >= 2 && !locations.some((el: Location) => (!el.lat || !el.lng))) {
      const body = getRequestBody(locations)

      routingApi(profile, authorization, body)
      .then((response: Response) => this.setState({ response, body }))
      .catch(() => this.setState({ message: 'There was an error fetching the route. Try again later' }))
    }
  }

  // TODO: Update app state based on changes
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

  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })
  handleHideClick = () => this.setState({ visible: false })

  public render() {

    const { locations, routePath, duration, distance, routingGraphVisible, response,
      polygonsVisible, geography, recenter, profile, authorization, visible, body } = this.state
    const { geographies, endpoint, urlMatchString } = this.props

    return (
      <AppWrapper>
        <Sidebar.Pushable as={StyledSegment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            vertical
            onHide={this.handleSidebarHide}
            visible={visible}
            width='very wide'
          >
            <RawResponse 
              handleHideClick={this.handleHideClick} 
              response={response}
              body={body}
              endpoint={endpoint}
            />
          </Sidebar>

          <Sidebar.Pusher>
            {duration && <RouteInfo duration={duration} distance={distance} />}
            <Panel 
              locations={locations}
              updatePoint={this.updatePoint}
              updateState={this.updateState}
              handleShowClick={this.handleShowClick}
              routingGraphVisible={routingGraphVisible}
              polygonsVisible={polygonsVisible}
              geography={geography}
              geographies={geographies}
              profile={profile}
              duration={duration}
              urlMatchString={urlMatchString}
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
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </AppWrapper>
    )
  }
}

export default App
