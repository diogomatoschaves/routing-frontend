import React, { Component, Fragment } from 'react'
import styled, { css } from 'styled-components'
import { generatePath } from 'react-router-dom'
import { Menu, Segment, Sidebar, Button, Icon, Transition } from 'semantic-ui-react'
import Map from './Map'
import Panel from './Panel'
import RouteInfo from './RouteInfo'
import TrafficLegend from './TrafficLegend'
import InspectPanel from './InspectPanel'
import '../App.css'
import { Validator } from 'jsonschema'
import {
  UpdatePoint,
  UpdateState,
  Location,
  RouteResponse,
  Geography,
  Route,
  Routes,
  Body,
  OptionsHandler,
  MatchResponse,
  Coords,
  HandleChange,
  HandleConfirmButton
} from '../types'
import {
  splitCoords,
  getRequestBody,
  formatCoords,
  validateJSON,
  processValidResponse,
  getAppState,
  getAppProps,
  processValidBody
} from '../utils/functions'
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
  TRAFFIC_POLYLINE,
  TRAFFIC_PARTY_STATS,
  PETROL_6
} from '../utils/colours'
import { EmptySpace, Box } from '../styledComponents'
import JSON5 from 'json5'
import { Schema } from '../utils/schemas/index'
import { defaultRoute, defaultRouteResponse } from '../utils/input';

interface State {
  validator?: Validator
  bodyColor: string
  recalculate: boolean
  locations: Array<Location>
  authorization: string
  response: RouteResponse | null
  trafficResponse: RouteResponse
  matchResponse: MatchResponse
  routes: Routes
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
  body: Body
  mapLoaded: boolean
  initialUpdate: boolean
  google?: any
  endpointHandler: OptionsHandler
  modeTabsHandler: OptionsHandler
  selectedService: number
  expanded: boolean
  debug: boolean
  bodyValue: string
  responseValue: string
  responseEdit: boolean
  bodyEdit: boolean,
  addedRoutes: Array<Route>
  newRoute: string
  routeHighlight: string
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
    width: 30%;
    min-width: 450px;
    max-width: 550px;
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
  ${props =>
    props.minwidth &&
    css`
      min-width: 450px;
    `}
  ${props =>
    props.maxwidth &&
    css`
      max-width: 550px;
    `}
`

const StyledButton = styled(Button)`
  &.ui.icon.button {
    padding: ${props => props.padding};
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 0.3s ease;
    background-color: ${PETROL_6};
    color: white;
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
  static defaultProps = getAppProps()

  state = getAppState()

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

  async componentDidMount() {
    const { windowProp, history, match, loadedProp } = this.props
    const { validator, response, body, locations, endpointHandler } = this.state
    const { requiredParams, acceptableProfiles } = this.props.urlParams

    let authorization: string = ''
    if (process.env.NODE_ENV !== 'production') {
      const password = process.env.REACT_APP_LDAP_PASSWORD
      const username = process.env.REACT_APP_LDAP_USERNAME
      authorization = `Basic ${Base64.encode(`${username}:${password}`)}`
    } else {
      const url = process.env.REACT_APP_URL + '/auth'
      await fetch(url)
        .then(response => response.json())
        .then(jsonifiedResponse => {
          authorization = jsonifiedResponse.basicAuth
        })
    }

    this.addGoogleObject(windowProp)

    this.setState({ authorization })

    Promise.resolve(
      Object.keys(Schema.Route).forEach((obj: any) => {
        validator.addSchema(Schema.Route[obj], `/${obj}`)
      })
    ).then(() => {
      Object.keys(Schema.Match).forEach((obj: any) => {
        validator.addSchema(Schema.Match[obj], `/${obj}`)
      })
    })

    this.setState({
      validator,
      bodyValue: JSON5.stringify(body, null, 2),
      responseValue: JSON5.stringify(response, null, 2)
    })

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
          false, // trafficOption
          true,
          endpointHandler.options[endpointHandler.activeIdx].text
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
      endpointHandler,
      recalculate,
      visible,
      modeTabsHandler,
      body,
      responseEdit,
      bodyEdit
    } = this.state

    const { urlMatchString, history, defaultColor } = this.props
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
          id: 'routeDAS',
          routePath: leg.geometry,
          duration: leg.duration,
          distance: leg.distance
        }
        this.setState(state => ({ 
          ...state,
          routes: {
            ...state.routes,
            route
          }
        }))
      }
    }

    if (prevState.trafficResponse !== trafficResponse) {
      if (Object.keys(trafficResponse).includes('code') && trafficResponse.code == 'Ok') {
        const leg = trafficResponse.routes[0].legs[0]
        const trafficRoute = {
          id: 'routeTrafficDAS',
          routePath: leg.geometry,
          duration: leg.duration,
          distance: leg.distance
        }
        
        this.setState(state => ({ 
          ...state,
          routes: {
            ...state.routes,
            trafficRoute
          }
        }))
      }
    }

    // TODO: Check if there is a callback for back and forward buttons
    // Check if coordinates are given by checking the URL parameters
    if (
      Object.keys(params).length === 3 &&
      (prevState.endpointHandler.activeIdx !== endpointHandler.activeIdx ||
        (Object.keys(params).some(key => params[key] !== prevParams[key]) ||
          Object.keys(prevParams).some(key => prevParams[key] !== params[key])))
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
          googleMapsOption && prevState.endpointHandler.activeIdx === endpointHandler.activeIdx,
          google,
          trafficOption,
          true,
          endpointHandler.options[endpointHandler.activeIdx].text
        )
      } else this.updateState('recalculate', true)
    }

    if (prevState.visible !== visible && visible) {
      this.setState({ expanded: false })
    }

    if (prevState.modeTabsHandler.activeIdx !== modeTabsHandler.activeIdx) {
      this.setState({
        debug:
          modeTabsHandler.activeIdx ===
          modeTabsHandler.options.filter(el => el.key === 'debug')[0].value
      })
    }

    if (prevState.body !== body || (prevState.bodyEdit !== bodyEdit && !bodyEdit)) {
      this.setState({
        bodyValue: JSON5.stringify(body, null, 2),
        bodyColor: defaultColor
      })
    }

    if (
      prevState.response !== response ||
      (prevState.responseEdit !== responseEdit && !responseEdit)
    ) {
      this.setState({
        responseValue: JSON5.stringify(response, null, 2),
      })
    }

    if (prevState.trafficOption !== trafficOption) {
      if (!trafficOption) {
        this.setState(state => ({ 
          ...state,
          routes: {
            ...state.routes,
            trafficRoute: defaultRoute
          },
          trafficResponse: defaultRouteResponse
        }))
      } else {
        this.getRoute(
          locations,
          profile,
          authorization,
          false,
          google,
          trafficOption,
          false,
          endpointHandler.options[endpointHandler.activeIdx].text
        )
      }
    }
    if (prevState.googleMapsOption !== googleMapsOption) {
      if (!googleMapsOption) {
        this.setState(state => ({ 
          ...state,
          routes: {
            ...state.routes,
            googleRoute: defaultRoute
          }
        }))
      } else {
        this.getRoute(
          locations,
          profile,
          authorization,
          googleMapsOption,
          google,
          false,
          false,
          endpointHandler.options[endpointHandler.activeIdx].text
        )
      }
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
    trafficOption: boolean,
    defaultOption: boolean,
    endpointUrl: string
  ) => {
    if (locations.length >= 2 && !locations.some((el: Location) => !el.lat || !el.lng)) {
      const body = getRequestBody(locations)

      if (defaultOption) {
        routingApi(profile, authorization, body, endpointUrl)
        .then((response: RouteResponse) => this.setState({ response, body }))
        .catch(() =>
          this.setState({
            message: 'There was an error fetching the route. Try again later'
          })
        )
      }

      if (googleMapsOption && google) {
        googleDirections(google, profile, locations)
          .then((googleRoute: Route) => {
            this.setState(state => ({ 
              ...state,
              routes: {
                ...state.routes,
                googleRoute
              }
            }))
          })
          .catch(() =>
            this.setState({
              googleMessage:
                'There was an error fetching the google route. Try again later'
            })
          )
      }

      if (trafficOption && profile === 'car') {
        routingApi('car-traffic', authorization, body, endpointUrl)
          .then((trafficResponse: RouteResponse) => {
            this.setState({ trafficResponse })
          })
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
      () => { return Promise.resolve(true) }
    )
  }

  handleValueUpdate: HandleChange = ({ id, value }) => {
    const { validator, selectedService } = this.state
    const { defaultColor } = this.props

    const service = serviceOptions[selectedService].key
    return validateJSON(
      value,
      validator,
      service,
      id.includes('body') ? 'body' : 'response',
      id.includes('body') ? 'body' : id.includes('response') ? 'response' : 'newRoute',
      defaultColor,
      this.updateStateCallback,
    )
  }

  handleAddRoute: HandleConfirmButton = (setState, value) => {
    if (this.handleValueUpdate({ id: 'response', value })) {
      const { addedRoutes } = this.state
      const parsedValue = JSON5.parse(value)
      processValidResponse(this.updateState, parsedValue, addedRoutes)
      setState(false)
      this.setState({ newRoute: '' })
    }
  }

  handleChangeBody: HandleConfirmButton = (setState, value) => {
    if (this.handleValueUpdate({ id: 'body', value })) {
      const { locations } = this.state
      const parsedValue = JSON5.parse(value)
      processValidBody(this.updatePoint, locations, parsedValue)
      setState(false)
    }
  }

  handleCloseModal: HandleConfirmButton = (setState, value) => {
    setState(false)
  }

  updateStateCallback = (callback: any) => {
    this.setState(callback)
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
      routes,
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
      responseOption,
      endpointHandler,
      modeTabsHandler,
      selectedService,
      expanded,
      debug,
      bodyColor,
      bodyValue,
      bodyEdit,
      responseValue,
      responseEdit,
      addedRoutes,
      newRoute,
      newRouteColor,
      addDataTabsHandler,
      routeHighlight
    } = this.state
    const { geographies, urlMatchString } = this.props
    const { show, hide } = this.props.animationDuration

    const showTraffic =
      trafficOption && routes.trafficRoute.distance && profile !== 'foot'

    return (
      <AppWrapper>
        <Sidebar.Pushable as={StyledSegment}>
          <StyledDiv direction="row">
            <StyledEmptyDiv
              width={visible ? '30%' : 0}
              minwidth={visible && true}
              maxwidth={visible && true}
              height={'10%'}
              position="relative"
            />
            <Transition.Group
              as={StyledButton}
              padding={expanded ? '10px' : '10px 4px'}
              duration={{ show, hide }}
              animation={'scale'}
              onClick={
                visible ? (e: any) => this.handleHideClick(e) : this.handleShowClick
              }
              onMouseEnter={(e: any) => this.setState({ expanded: true })}
              onMouseLeave={(e: any) => this.setState({ expanded: false })}
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
            <InspectPanel
              handleHideClick={this.handleHideClick}
              response={
                serviceOptions[selectedService].key === 'Route'
                  ? responseOption === 'normal'
                    ? response
                    : trafficResponse
                  : matchResponse
              }
              body={body}
              endpointHandler={endpointHandler}
              updatePoint={this.updatePoint}
              updateState={this.updateState}
              handleValueUpdate={this.handleValueUpdate}
              responseOption={responseOption}
              locations={locations}
              selectedService={selectedService}
              serviceOptions={serviceOptions}
              bodyValue={bodyValue}
              bodyColor={bodyColor}
              bodyEdit={bodyEdit}
              responseValue={responseValue}
              responseEdit={responseEdit}
              debug={debug}
              addedRoutes={addedRoutes}
              newRoute={newRoute}
              newRouteColor={newRouteColor}
              addDataTabsHandler={addDataTabsHandler}
              modeTabsHandler={modeTabsHandler}
              handleAddRoute={this.handleAddRoute}
              handleChangeBody={this.handleChangeBody}
              handleCloseModal={this.handleCloseModal}
            />
          </Sidebar>
          <Sidebar.Pusher>
            {!debug && (
              <Fragment>
                {routes.route.distance && (
                  <RouteInfo
                    statsColor={ROUTING_SERVICE_STATS}
                    textColor={ROUTING_SERVICE}
                    iconColor={POLYLINE_COLOR}
                    title={'Routing Service'}
                    subTitle={'No Traffic'}
                    route={routes.route}
                    top={'40px'}
                    right={'50px'}
                  />
                )}
                {showTraffic && (
                  <RouteInfo
                    statsColor={TRAFFIC_PARTY_STATS}
                    textColor={TRAFFIC_PARTY_COLOR}
                    iconColor={TRAFFIC_POLYLINE}
                    title={'Routing Service'}
                    subTitle={'With Traffic'}
                    route={routes.trafficRoute}
                    top={'270px'}
                    right={'50px'}
                  />
                )}
                {googleMapsOption && routes.googleRoute.distance && (
                  <RouteInfo
                    statsColor={THIRD_PARTY_STATS}
                    textColor={THIRD_PARTY_COLOR}
                    iconColor={THIRD_PARTY_POLYLINE}
                    title={'Google Maps'}
                    route={routes.googleRoute}
                    top={showTraffic ? '515px' : '270px'}
                    right={'50px'}
                  />
                )}
              </Fragment>
            )}
            <Panel
              locations={locations}
              updatePoint={this.updatePoint}
              updateState={this.updateState}
              handleConfirmButton={this.handleAddRoute}
              handleValueUpdate={this.handleValueUpdate}
              handleShowClick={this.handleShowClick}
              routingGraphVisible={routingGraphVisible}
              polygonsVisible={polygonsVisible}
              geography={geography}
              geographies={geographies}
              profile={profile}
              urlMatchString={urlMatchString}
              googleMapsOption={googleMapsOption}
              trafficOption={trafficOption}
              debug={debug}
              modeTabsHandler={modeTabsHandler}
              newRoute={newRoute}
              newRouteColor={newRouteColor}
              addDataTabsHandler={addDataTabsHandler}
            />
            <Map
              locations={locations}
              profile={profile}
              updatePoint={this.updatePoint}
              updateState={this.updateState}
              routes={routes}
              routingGraphVisible={routingGraphVisible}
              polygonsVisible={polygonsVisible}
              googleMapsOption={googleMapsOption}
              trafficOption={trafficOption}
              geography={geography}
              geographies={geographies}
              recenter={recenter}
              authorization={authorization}
              endpointHandler={endpointHandler}
              debug={debug}
              addedRoutes={addedRoutes}
              routeHighlight={routeHighlight}
            />
            {routingGraphVisible && <TrafficLegend />}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </AppWrapper>
    )
  }
}

export default App
