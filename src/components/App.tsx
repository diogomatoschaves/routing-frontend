import React, { Component, createRef } from 'react'
import styled, { css } from 'styled-components'
import { generatePath } from 'react-router-dom'
import { Menu, Segment, Sidebar, Button, Icon, Transition } from 'semantic-ui-react'
import Map from './Map'
import Panel from './Panel'
import RouteInfo from './RouteInfo'
import TrafficLegend from './TrafficLegend'
import OptionsPanel from './OptionsPanel'
import '../App.css'
import {
  UpdatePoint,
  UpdateState,
  Location,
  RouteResponse,
  Geography,
  Route,
  Body,
  MatchResponse,
  Coords
} from '../types'
import { defaultRouteResponse, defaultRoute, defaultMatchResponse, defaultBody } from '../utils/input'
import { splitCoords, getRequestBody, formatCoords } from '../utils/functions'
import { Base64 } from 'js-base64'
import { routingApi, googleDirections } from '../apiCalls'
import {
  POLYLINE_COLOR,
  ROUTING_SERVICE,
  ROUTING_SERVICE_STATS,
  THIRD_PARTY_COLOR,
  THIRD_PARTY_POLYLINE,
  THIRD_PARTY_STATS,
  TRAFFIC_PARTY_COLOR,
  TRAFFIC_PARTY_POLYLINE,
  TRAFFIC_PARTY_STATS,
  PETROL_6
} from '../utils/colours'
import { EmptySpace, Box } from '../styledComponents';

interface State {
  recalculate: boolean
  locations: Array<Location>
  authorization: string
  response: RouteResponse | null
  trafficResponse: RouteResponse
  matchResponse: MatchResponse
  route: Route
  trafficRoute: Route
  message?: string | null
  googleMessage?: string | null
  routingGraphVisible?: boolean
  googleMapsOption?: boolean
  trafficOption?: boolean
  polygonsVisible?: boolean
  responseOption: string
  geography: Geography
  recenter: boolean
  profile: string
  visible: boolean
  body?: Body | undefined
  mapLoaded: boolean
  initialUpdate: boolean
  google?: any
  googleRoute?: Route | null
  selectedService: number
  expanded: boolean
}

const AppWrapper: any = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`

const StyledSegment = styled(Segment)`
  & > .ui.left.visible.sidebar {
    border: none;
    box-shadow: 10px 10px 16px -9px rgba(77, 77, 77, 0.5);
    width: 32%;
    min-width: 500px;
    max-width: 600px;
    transform: none;
  }
`

const StyledDiv = styled(Box)`
  position: absolute;
  transition: all 0.5s linear;
  left: ${(props: any) => (props.left ? props.left : 0)};
  bottom: 50px;
  z-index: 10;
` as any

const StyledEmptyDiv = styled(EmptySpace)`
  /* transition: all 0.5s linear; */
  ${props => props.minwidth && css `min-width: 500px;`}
  ${props => props.maxwidth && css `max-width: 600px;`}
`

const StyledButton = styled(Button)`
  &.ui.button {
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 0.5s linear;
    background-color: ${PETROL_6} !important;
    color: white !important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`

declare global {
  interface Window {
    google: any
  }
}

const serviceOptions = [
  {
    key: 'Route',
    text: 'Route',
    value: 0
  },
  {
    key: 'Match',
    text: 'Match',
    value: 1
  }
]

class App extends Component<any, State> {
  static defaultProps = {
    geographies: [
      {
        name: 'Berlin',
        coords: [13.38408, 52.51721],
        polygon: 'berlin.geojson'
      },
      {
        name: 'Stuttgart',
        coords: [9.033, 48.7111],
        polygon: 'stuttgart.geojson'
      },
      {
        name: 'Immendingen',
        coords: [8.7214, 47.912],
        polygon: 'immendingen.geojson'
      },
      {
        name: 'San José',
        coords: [-121.97588, 37.34606],
        polygon: 'sunnyvale.geojson'
      }
    ],
    urlParams: {
      matching: ['', '/:profile', '/:start', '/:end'],
      requiredParams: {
        profile: 'profile',
        start: 'start',
        end: 'end'
      },
      acceptableProfiles: ['car', 'foot']
    },
    endpoint: 'https://routing.develop.otonomousmobility.com',
    animationDuration: { show: 500, hide: 100 }
  }

  state = { 
    selectedService: 0,
    recalculate: true,
    initialUpdate: false,
    body: defaultBody,
    mapLoaded: false,
    visible: false,
    google: null,
    googleRoute: null,
    routingGraphVisible: false,
    polygonsVisible: false,
    googleMapsOption: false,
    trafficOption: false,
    profile: 'car',
    geography: {
      name: 'Berlin',
      coords: [13.38408, 52.51721],
      polygon: 'berlin.geojson'
    },
    responseOption: 'normal',
    recenter: false,
    expanded: false,
    authorization: '',
    route: defaultRoute,
    trafficRoute: defaultRoute,
    matchResponse: defaultMatchResponse,
    response: defaultRouteResponse,
    trafficResponse: defaultRouteResponse,
    locations: [
      {
        name: 'start',
        marker: 'map marker alternate',
        markerOffset: [0, 5],
        placeholder: 'Origin',
        lat: null,
        lng: null
      },
      {
        name: 'end',
        marker: 'map marker',
        markerOffset: [0, 5],
        placeholder: 'Destination',
        lat: null,
        lng: null
      }
    ]
  }

  getProfileLocations = (
    locations: Array<Location>,
    params: any,
    requiredParams: any
  ) => {
    return {
      locations: locations.map((item: Location) => ({
        ...item,
        ...splitCoords(params[requiredParams[item.name]])
      })),
      profile: params[requiredParams.profile]
    }
  }

  componentDidMount() {
    const { windowProp } = this.props

    const username = process.env.REACT_APP_LDAP_USERNAME
    const password = process.env.REACT_APP_LDAP_PASSWORD

    const authorization = `Basic ${Base64.encode(`${username}:${password}`)}`

    this.addGoogleObject(windowProp)

    this.setState({ authorization })

    const { history, match, loadedProp } = this.props
    const { requiredParams, acceptableProfiles } = this.props.urlParams
    const { locations } = this.state

    const params = Object.keys(match.params)

    if (
      params.length === 3 &&
      params.every((el: string) => {
        return (
          ([requiredParams.start, requiredParams.end].includes(el) &&
            Boolean(splitCoords(match.params[el]))) ||
          (el === requiredParams.profile && acceptableProfiles.includes(match.params[el]))
        )
      })
    ) {
      this.waitTillLoaded(loadedProp).then(() => {
        const { profile: urlProfile, locations: urlLocations } = this.getProfileLocations(
          locations,
          match.params,
          requiredParams
        )

        this.getRoute(
          urlLocations,
          urlProfile,
          authorization,
          false, // googleMapsOption,
          null, // google,
          false // trafficOption
        )
        this.setState({ profile: urlProfile, locations: urlLocations })
      })
    } else {
      const { profile } = this.state
      const path = generatePath('/:profile', { profile })
      history.push(path)
    }
  }

  componentDidUpdate(prevProps: any, prevState: State) {
    const {
      locations,
      authorization,
      response,
      profile,
      googleMapsOption,
      google,
      trafficOption,
      trafficResponse,
      recalculate,
      visible
    } = this.state

    const { urlMatchString, history } = this.props
    const { params: prevParams } = prevProps.match
    const { params } = this.props.match
    const { requiredParams } = this.props.urlParams

    if (prevState.locations !== locations || prevState.profile !== profile) {
      const path = generatePath(urlMatchString, {
        ...locations.reduce((accum, item) => {
          return {
            ...accum,
            [item.name]:
              item.lat && item.lng ? formatCoords({ lat: item.lat, lng: item.lng }) : '-'
          }
        }, {}),
        profile
      })
      history.push(path)
    }

    if (prevState.response !== response) {
      if (Object.keys(response).includes('code') && response.code == 'Ok') {
        const leg = response.routes[0].legs[0]
        const route = {
          routePath: leg.geometry,
          duration: leg.duration,
          distance: leg.distance
        }
        this.setState({ route })
      }
    }

    if (prevState.trafficResponse !== trafficResponse) {
      if (Object.keys(trafficResponse).includes('code') && response.code == 'Ok') {
        const leg = trafficResponse.routes[0].legs[0]
        const trafficRoute = {
          routePath: leg.geometry,
          duration: leg.duration,
          distance: leg.distance
        }
        this.setState({ trafficRoute })
      }
    }

    // TODO: Check if there is a callback for back and forward buttons
    if (
      // prevParams !== params &&
      (Object.keys(params).some(key => params[key] !== prevParams[key]) ||
        Object.keys(prevParams).some(key => prevParams[key] !== params[key])) &&
      Object.keys(params).length === 3
    ) {
      const { locations: urlLocations, profile: urlProfile } = this.getProfileLocations(
        locations,
        params,
        requiredParams
      )

      if (recalculate) {
        this.getRoute(
          urlLocations,
          urlProfile,
          authorization,
          googleMapsOption,
          google,
          trafficOption
        )
      } else this.updateState('recalculate', true)
    }

    if (prevState.visible !== visible && visible) {
      this.setState({ expanded: false })
    }
  }

  waitTillLoaded = (loadedProp: boolean) => {
    if (loadedProp) return Promise.resolve(loadedProp)

    return new Promise(resolve => {
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

  getRoute = (
    locations: Array<Location>,
    profile: string,
    authorization: string,
    googleMapsOption: boolean,
    google: any,
    trafficOption: boolean
  ) => {
    if (locations.length >= 2 && !locations.some((el: Location) => !el.lat || !el.lng)) {
      const body = getRequestBody(locations)

      routingApi(profile, authorization, body)
        .then((response: RouteResponse) => this.setState({ response, body }))
        .catch(() =>
          this.setState({
            message: 'There was an error fetching the route. Try again later'
          })
        )

      if (googleMapsOption && google) {
        googleDirections(google, profile, locations)
          .then((googleRoute: Route) => this.setState({ googleRoute }))
          .catch(() =>
            this.setState({
              googleMessage:
                'There was an error fetching the google route. Try again later'
            })
          )
      }

      if (trafficOption && profile === 'car') {
        routingApi('car-traffic', authorization, body)
          .then((trafficResponse: RouteResponse) => this.setState({ trafficResponse }))
          .catch(() =>
            this.setState({
              message: 'There was an error fetching the route. Try again later'
            })
          )
      }
    }
  }

  addGoogleObject = (windowProp: boolean) => {
    if (!windowProp && !window.google) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://maps.google.com/maps/api/js?key=${
        process.env.REACT_APP_GOOGLE_MAPS_TOKEN
      }`
      const head = document.getElementsByTagName('head')[0]
      head.appendChild(script)

      script.addEventListener('load', e => {
        console.log('google was loaded')
        this.setState({ google: window.google })
      })
    } else {
      this.setState({ google: window.google || windowProp })
    }
  }

  // TODO: Update app state based on changes
  updatePoint: UpdatePoint = (indexes: number[], coords: Array<Coords>) => {
    this.setState(state => {
      return {
        locations: state.locations.reduce(
          (accum: Array<Location>, element: Location, currentIndex: number) => {
            if (!indexes.includes(currentIndex)) {
              return [...accum, element]
            } else {
              const index = indexes.findIndex(el => el === currentIndex)
              return [
                  ...accum,
                  {
                    ...element,
                    lat: coords[index].lat,
                    lng: coords[index].lng
                  }
                ]
            }
          },
          []
        )
      }
    })
  }

  updateState: UpdateState = (stateKey: string, value: any) => {
    this.setState(
      prevState => ({
        ...prevState,
        [stateKey]: value
      }),
      () => Promise.resolve(true)
    )
  }

  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })
  handleHideClick = (e: any) => {
    e.stopPropagation()
    this.setState({ visible: false })
  }

  public render() {
    const {
      locations,
      route,
      trafficRoute,
      routingGraphVisible,
      response,
      trafficResponse,
      matchResponse,
      googleMapsOption,
      trafficOption,
      polygonsVisible,
      geography,
      recenter,
      profile,
      authorization,
      visible,
      body,
      googleRoute,
      responseOption,
      selectedService,
      expanded
    } = this.state
    const { geographies, endpoint, urlMatchString } = this.props
    const { show, hide } = this.props.animationDuration

    const showTraffic = trafficRoute && trafficRoute.distance && profile !== 'foot'

    return (
      <AppWrapper>
        <Sidebar.Pushable as={StyledSegment}>
          <StyledDiv 
            direction="row" 
          >
            <StyledEmptyDiv 
              width={visible ? '32%' : 0} 
              minwidth={visible && true}
              maxwidth={visible && true}
              height={'10%'} 
              position="relative"
            />
            <Transition.Group 
              as={StyledButton} 
              duration={{ show, hide }}
              animation={'scale'}
              onClick={visible ? (e: any) => this.handleHideClick(e) : this.handleShowClick}
              onMouseEnter={(e: any) => {e.stopPropagation(); !visible && this.setState({ expanded: true })}}
              onMouseLeave={(e: any) => {e.stopPropagation(); !visible && this.setState({ expanded: false })}}
              icon
              className={'options-button'}
            >
              <Icon
                size="big"
                name={visible ? 'chevron left' : ('chevron right' as any)}
              />
              {expanded && !visible && <span> Inspect </span>}
            </Transition.Group>            
          </StyledDiv>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            vertical
            visible={visible}
            width="very wide"
          >
            <OptionsPanel
              handleHideClick={this.handleHideClick}
              response={serviceOptions[selectedService].key === 'Route' 
                ? responseOption === 'normal' ? response : trafficResponse : matchResponse}
              body={body}
              endpoint={endpoint}
              updatePoint={this.updatePoint}
              updateState={this.updateState}
              responseOption={responseOption}
              locations={locations}
              selectedService={selectedService}
              serviceOptions={serviceOptions}
            >
            </OptionsPanel>
          </Sidebar>
          <Sidebar.Pusher>
            
            {route && route.distance && (
              <RouteInfo
                statsColor={ROUTING_SERVICE_STATS}
                textColor={ROUTING_SERVICE}
                iconColor={POLYLINE_COLOR}
                title={'Routing Service'}
                subTitle={'No Traffic'}
                route={route}
                top={'40px'}
                right={'50px'}
              />
            )}
            {showTraffic && (
              <RouteInfo
                statsColor={TRAFFIC_PARTY_STATS}
                textColor={TRAFFIC_PARTY_COLOR}
                iconColor={TRAFFIC_PARTY_POLYLINE}
                title={'Routing Service'}
                subTitle={'With Traffic'}
                route={trafficRoute}
                top={'270px'}
                right={'50px'}
              />
            )}
            {googleRoute && (
              <RouteInfo
                statsColor={THIRD_PARTY_STATS}
                textColor={THIRD_PARTY_COLOR}
                iconColor={THIRD_PARTY_POLYLINE}
                title={'Google Maps'}
                route={googleRoute}
                top={showTraffic ? '515px' : '270px'}
                right={'50px'}
              />
            )}
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
              route={route}
              urlMatchString={urlMatchString}
              googleMapsOption={googleMapsOption}
              googleRoute={googleRoute}
            />
            <Map
              locations={locations}
              profile={profile}
              updatePoint={this.updatePoint}
              updateState={this.updateState}
              routePath={route.routePath}
              trafficRoutePath={trafficRoute.routePath}
              routingGraphVisible={routingGraphVisible}
              polygonsVisible={polygonsVisible}
              googleMapsOption={googleMapsOption}
              trafficOption={trafficOption}
              geography={geography}
              geographies={geographies}
              recenter={recenter}
              authorization={authorization}
              googleRoute={googleRoute}
            />
            {routingGraphVisible && <TrafficLegend />}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </AppWrapper>
    )
  }
}

export default App
