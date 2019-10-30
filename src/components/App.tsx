import { Base64 } from 'js-base64'
import JSON5 from 'json5'
import { Validator } from 'jsonschema'
import React, { Component, Fragment } from 'react'
import { generatePath } from 'react-router-dom'
import { Button, Icon, Menu, Segment, Sidebar, Transition } from 'semantic-ui-react'
import styled, { css } from 'styled-components'
import { auth, googleDirections, routingApi } from '../apiCalls'
import '../App.css'
import Map from './Map'
import { Box, EmptySpace } from '../styledComponents'
import {
  Body,
  Coords,
  GeographiesHandler,
  GoogleResponse,
  HandleConfirmButton,
  HandleDeleteRoute,
  HandleValueUpdate,
  InputColors,
  InputValues,
  Location,
  Messages,
  OptionsHandler,
  ProfileItem,
  ResponseOptionsHandler,
  Responses,
  Route,
  RouteResponse,
  Routes,
  UpdatePoint,
  UpdateState
} from '../types'
import {
  PETROL_6,
  POLYLINE_COLOR,
  ROUTING_SERVICE,
  ROUTING_SERVICE_STATS,
  THIRD_PARTY_COLOR,
  THIRD_PARTY_POLYLINE,
  THIRD_PARTY_STATS,
  TRAFFIC_COLOR,
  TRAFFIC_POLYLINE,
  TRAFFIC_STATS
} from '../utils/colours'
import {
  capitalize,
  formatCoords,
  getAppProps,
  getAppState,
  getRequestBody,
  processValidBody,
  processValidResponse,
  validateJSON
} from '../utils/functions'
import { defaultGoogleResponse, defaultRoute, defaultRouteResponse } from '../utils/input'
import {
  routeConverterFromGoogle,
  routeConverterFromMatchService,
  routeConverterFromRouteService
} from '../utils/routeAdapter'
import { Schema } from '../utils/schemas'
import { checkUrlValidity, extractUrlParams } from '../utils/urlConfig'
import InspectPanel from './InspectPanel'
import Message from './Message'
import Panel from './Panel'
import RouteInfo from './RouteInfo'
import TrafficLegend from './TrafficLegend'

interface State {
  validator?: Validator
  recalculate: boolean
  locations: Location[]
  authorization: string
  responses: Responses
  routes: Routes
  showMessage: boolean
  messages: Messages
  messageBottomProp: number
  routingGraphVisible?: boolean
  googleMapsOption?: boolean
  trafficOption?: boolean
  polygonsVisible?: boolean
  responseOptionsHandler: ResponseOptionsHandler
  geographies: GeographiesHandler
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
  responseEdit: boolean
  bodyEdit: boolean
  addedRoutes: Route[]
  inputValues: InputValues
  inputColors: InputColors
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
    width: 28.8%;
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
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 0.3s ease;
    background-color: ${PETROL_6};
    color: white;
    border-radius: 0 5px 5px 0;
  }
`

const StyledBox = styled(Box)`
  transition: bottom 1s ease;
  position: fixed;
  ${(props: any) =>
    props.bottom &&
    css`
      bottom: ${props.bottom}px;
    `}
`

const messageFailedRoute = (traffic: boolean, response: RouteResponse) => (
  <span>
    <span style={{ color: traffic ? TRAFFIC_POLYLINE : POLYLINE_COLOR }}>
      Routing Service{traffic ? ' - traffic' : ''}:
    </span>
    <span> {response.code}. </span>
    <span style={{ color: traffic ? TRAFFIC_POLYLINE : POLYLINE_COLOR }}>
      {response.message}
    </span>
  </span>
)

const messageFailedGoogleRoute = (googleResponse: GoogleResponse) => (
  <span>
    <span style={{ color: THIRD_PARTY_POLYLINE }}>Google: </span>
    <span>{googleResponse.status}.</span>
    <span style={{ color: THIRD_PARTY_POLYLINE }}> Failed to provide a route.</span>
  </span>
)

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

function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj
}

class App extends Component<any, State> {
  public static defaultProps = getAppProps()

  public messageTimeout: any

  public state = getAppState()

  public async componentDidMount() {
    const { windowProp, history, match, loadedProp } = this.props
    const { validator, responses, body, locations, endpointHandler } = this.state
    const { profiles } = this.props

    let authorization: string = ''
    if (process.env.NODE_ENV !== 'production') {
      const password = process.env.REACT_APP_LDAP_PASSWORD
      const username = process.env.REACT_APP_LDAP_USERNAME
      authorization = `Basic ${Base64.encode(`${username}:${password}`)}`
    } else {
      await auth(process.env.REACT_APP_URL || '').then(jsonifiedResponse => {
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

    this.setState(state => ({
      ...state,
      inputValues: {
        ...state.inputValues,
        body: JSON.stringify(body, null, 2),
        response: JSON.stringify(responses.routeResponse, null, 2)
      },
      validator
    }))

    if (
      checkUrlValidity(match.params, profiles.map((profile: ProfileItem) => profile.name))
    ) {
      this.waitTillLoaded(loadedProp).then(() => {
        const { profile: urlProfile, locations: urlLocations } = extractUrlParams(
          locations,
          match.params
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

  public componentDidUpdate(prevProps: any, prevState: State) {
    const {
      locations,
      authorization,
      profile,
      googleMapsOption,
      google,
      trafficOption,
      endpointHandler,
      recalculate,
      visible,
      modeTabsHandler,
      body,
      responseEdit,
      bodyEdit,
      showMessage,
      responseOptionsHandler,
      responses
    } = this.state

    const { urlMatchString, history, defaultColor } = this.props
    const { params: prevParams } = prevProps.match
    const { params } = this.props.match

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

    if (prevState.responses.routeResponse !== responses.routeResponse) {
      this.updateRoute(responses.routeResponse, 'routeDAS', 'route')
    }

    if (prevState.responses.trafficResponse !== responses.trafficResponse) {
      this.updateRoute(responses.trafficResponse, 'routeTrafficDAS', 'trafficRoute')
    }

    if (prevState.responses.googleResponse !== responses.googleResponse) {
      this.updateGoogleRoute(responses.googleResponse)
    }

    // TODO: Check if there is a callback for back and forward buttons
    // Check if coordinates are given by checking the URL parameters
    if (
      Object.keys(params).length === 3 &&
      (prevState.endpointHandler.activeIdx !== endpointHandler.activeIdx ||
        (Object.keys(params).some(key => params[key] !== prevParams[key]) ||
          Object.keys(prevParams).some(key => prevParams[key] !== params[key])))
    ) {
      const { locations: urlLocations, profile: urlProfile } = extractUrlParams(
        locations,
        params
      )

      if (recalculate) {
        this.getRoute(
          urlLocations,
          urlProfile,
          authorization,
          googleMapsOption &&
            prevState.endpointHandler.activeIdx === endpointHandler.activeIdx,
          google,
          trafficOption,
          true,
          endpointHandler.options[endpointHandler.activeIdx].text
        )
      } else {
        this.updateState('recalculate', true)
      }
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
      this.setState(state => ({
        ...state,
        inputColors: {
          ...state.inputColors,
          body: defaultColor
        },
        inputValues: {
          ...state.inputValues,
          body: JSON.stringify(body, null, 2)
        }
      }))
    }

    if (prevState.responseEdit !== responseEdit) {
      const responseOption =
        responseOptionsHandler.options[responseOptionsHandler.activeIdx]
      const responseKey = responseOption.key
      const response = hasKey(responses, responseKey)
        ? responses[responseKey]
        : responses.routeResponse

      this.setState(state => ({
        ...state,
        inputValues: {
          ...state.inputValues,
          response: JSON.stringify(response, null, 2)
        }
      }))
    }

    if (prevState.trafficOption !== trafficOption) {
      if (!trafficOption) {
        this.setState(state => ({
          ...state,
          responses: {
            ...state.responses,
            trafficResponse: defaultRouteResponse
          }
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
          responses: {
            ...state.responses,
            googleResponse: defaultGoogleResponse
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

    if (prevState.showMessage !== showMessage && showMessage) {
      this.setState({ messageBottomProp: 40, showMessage: false })

      if (this.messageTimeout) {
        clearTimeout(this.messageTimeout)
      }
      this.messageTimeout = setTimeout(() => {
        this.setState(
          {
            messageBottomProp: -300
          },
          () => {
            if (this.messageTimeout) {
              clearTimeout(this.messageTimeout)
            }
            this.messageTimeout = setTimeout(() => {
              this.setState({
                messages: {
                  googleMessage: null,
                  routeMessage: null,
                  trafficMessage: null
                }
              })
            }, 1000)
          }
        )
      }, 4200)
    }
  }

  public waitTillLoaded = (loadedProp: boolean) => {
    if (loadedProp) {
      return Promise.resolve(loadedProp)
    }

    return new Promise(resolve => {
      const timeoutCallback = () => {
        i++
        const { mapLoaded } = this.state

        if (mapLoaded) {
          resolve(mapLoaded)
        } else {
          setTimeout(timeoutCallback, i * 300)
        }
      }
      let i = 0
      setTimeout(timeoutCallback, i * 300)
    })
  }

  public getRoute = (
    locations: Location[],
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
        this.handleResponse(profile, authorization, body, endpointUrl, 'route')
      }

      if (googleMapsOption && google) {
        googleDirections(google, profile, locations)
          .then((googleResponse: GoogleResponse) => {
            this.setState(state => ({
              messages: {
                ...state.messages,
                googleMessage: null
              },
              responses: {
                ...state.responses,
                googleResponse
              }
            }))
          })
          .catch(() => {
            this.setState(state => ({
              messages: {
                ...state.messages,
                googleMessage: (
                  <span style={{ color: 'red' }}>
                    There was an error fetching a route from google.
                  </span>
                )
              },
              responses: {
                ...state.responses,
                googleResponse: defaultGoogleResponse
              },
              showMessage: true
            }))
          })
      }

      if (trafficOption && profile === 'car') {
        this.handleResponse('car-traffic', authorization, body, endpointUrl, 'traffic')
      }
    }
  }

  public handleResponse = (
    profile: string,
    authorization: string,
    body: Body,
    endpointUrl: string,
    routeName: string
  ) => {
    const response = `${routeName}Response`
    const message = `${routeName}Message`

    routingApi(profile, authorization, body, endpointUrl)
      .then((routeResponse: RouteResponse) => {
        this.setState(state => ({
          body,
          messages: {
            ...state.messages,
            [message]: null
          },
          responses: {
            ...state.responses,
            [response]: routeResponse
          }
        }))
      })
      .catch(() =>
        this.setState(state => ({
          messages: {
            ...state.messages,
            [message]: (
              <span style={{ color: 'red' }}>There was an error fetching the route.</span>
            )
          },
          responses: {
            ...state.responses,
            [response]: defaultRouteResponse
          },
          showMessage: true
        }))
      )
  }

  public addGoogleObject = (windowProp: boolean) => {
    if (!windowProp && !window.google) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://maps.google.com/maps/api/js?key=${
        process.env.REACT_APP_GOOGLE_MAPS_TOKEN
      }`
      const head = document.getElementsByTagName('head')[0]
      head.appendChild(script)

      script.addEventListener('load', () => {
        this.setState({ google: window.google })
      })
    } else {
      this.setState({ google: window.google || windowProp })
    }
  }

  // TODO: Update app state based on changes
  public updatePoint: UpdatePoint = (indexes: number[], coords: Coords[]) => {
    this.setState(state => {
      return {
        locations: state.locations.reduce(
          (accum: Location[], element: Location, currentIndex: number) => {
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

  public updateRoute = (response: RouteResponse, key: string, routeName: string) => {
    if (Object.keys(response).includes('code') && response.code === 'Ok') {
      const trafficRoute = routeConverterFromRouteService(response, key)
      this.setState(state => ({
        ...state,
        routes: {
          ...state.routes,
          [routeName]: trafficRoute
        }
      }))
    } else {
      const traffic = routeName.includes('traffic')
      this.setState(state => ({
        ...state,
        messages: {
          ...state.messages,
          [traffic ? 'trafficMessage' : 'routeMessage']: messageFailedRoute(
            traffic,
            response
          )
        },
        routes: {
          ...state.routes,
          [routeName]: defaultRoute
        },
        showMessage: true
      }))
    }
  }

  public updateGoogleRoute = (googleResponse: GoogleResponse) => {
    if (googleResponse.status === 'OK') {
      const googleRoute = routeConverterFromGoogle(googleResponse)
      this.setState(state => ({
        ...state,
        routes: {
          ...state.routes,
          googleRoute
        }
      }))
    } else {
      this.setState(state => ({
        ...state,
        messages: {
          ...state.messages,
          googleMessage: messageFailedGoogleRoute(googleResponse)
        },
        routes: {
          ...state.routes,
          googleRoute: defaultRoute
        },
        showMessage: true
      }))
    }
  }

  public updateState: UpdateState = (stateKey: string, value: any) => {
    this.setState(
      prevState => ({
        ...prevState,
        [stateKey]: value
      }),
      () => Promise.resolve(true)
    )
  }

  public handleValueUpdate: HandleValueUpdate = ({ id, value }) => {
    const { validator, addDataTabsHandler } = this.state
    const { defaultColor } = this.props

    const body = id === 'body'
    const service = body
      ? 'Route'
      : capitalize(addDataTabsHandler.options[addDataTabsHandler.activeIdx].key)

    return validateJSON(
      value,
      validator,
      service,
      body ? 'Body' : 'Response',
      id,
      defaultColor,
      this.updateStateCallback
    )
  }

  public handleAddRoute: HandleConfirmButton = (setState, value, id) => {
    if (this.handleValueUpdate({ id, value })) {
      const { addedRoutes, addDataTabsHandler } = this.state

      const service = capitalize(
        addDataTabsHandler.options[addDataTabsHandler.activeIdx].key
      )

      const parsedValue = JSON5.parse(value)
      const route =
        service === 'Match'
          ? routeConverterFromMatchService(parsedValue)
          : routeConverterFromRouteService(parsedValue)
      processValidResponse(this.updateState, route, addedRoutes)
      setState(false)
      this.setState(state => ({
        ...state,
        inputValues: {
          ...state.inputValues,
          [id]: ''
        }
      }))
    }
  }

  public handleChangeBody: HandleConfirmButton = (setState, value) => {
    if (this.handleValueUpdate({ id: 'body', value })) {
      const { locations } = this.state
      const parsedValue = JSON5.parse(value)
      processValidBody(this.updatePoint, locations, parsedValue)
      setState(false)
    }
  }

  public handleAddRouteFromDB: HandleConfirmButton = (setState, route) => {
    const { addedRoutes } = this.state
    processValidResponse(this.updateState, route, addedRoutes)
  }

  public handleCloseModal: HandleConfirmButton = setState => {
    setState(false)
  }

  public updateStateCallback = (callback: any) => {
    this.setState(callback)
  }

  public handleDeleteRoute: HandleDeleteRoute = (id: string) => {
    this.setState(prevState => ({
      ...prevState,
      addedRoutes: prevState.addedRoutes.filter(route => route.id !== id)
    }))
  }

  public handleShowClick = () => this.setState({ visible: true })
  public handleSidebarHide = () => this.setState({ visible: false })
  public handleHideClick = (e: any) => {
    e.stopPropagation()
    this.setState({ visible: false })
  }

  public render() {
    const {
      locations,
      routes,
      routingGraphVisible,
      responses,
      googleMapsOption,
      trafficOption,
      polygonsVisible,
      geographies,
      recenter,
      profile,
      authorization,
      visible,
      body,
      responseOptionsHandler,
      endpointHandler,
      modeTabsHandler,
      selectedService,
      expanded,
      debug,
      bodyEdit,
      responseEdit,
      addedRoutes,
      addDataTabsHandler,
      routeHighlight,
      messages,
      messageBottomProp,
      inputValues,
      inputColors
    } = this.state
    const { urlMatchString, profiles } = this.props
    const { show, hide } = this.props.animationDuration

    const { routeMessage, trafficMessage, googleMessage } = messages

    const responseOption =
      responseOptionsHandler.options[responseOptionsHandler.activeIdx]
    const responseKey = responseOption.key

    const showTraffic =
      trafficOption && routes.trafficRoute.distance && profile !== 'foot'

    return (
      <AppWrapper>
        <Sidebar.Pushable as={StyledSegment}>
          <StyledDiv direction="row" width="31%">
            <StyledEmptyDiv
              width={visible ? '100%' : 0}
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
              onMouseEnter={() => this.setState({ expanded: true })}
              onMouseLeave={() => this.setState({ expanded: false })}
              icon={true}
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
            vertical={true}
            visible={visible}
            width="very wide"
          >
            <InspectPanel
              handleHideClick={this.handleHideClick}
              response={
                serviceOptions[selectedService].key === 'Route'
                  ? hasKey(responses, responseKey)
                    ? responses[responseKey]
                    : responses.routeResponse
                  : responses.matchResponse
              }
              responseOptionsHandler={responseOptionsHandler}
              responseOption={responseOption}
              body={body}
              endpointHandler={endpointHandler}
              updatePoint={this.updatePoint}
              updateState={this.updateState}
              handleValueUpdate={this.handleValueUpdate}
              locations={locations}
              selectedService={selectedService}
              serviceOptions={serviceOptions}
              bodyEdit={bodyEdit}
              responseEdit={responseEdit}
              debug={debug}
              addedRoutes={addedRoutes}
              inputValues={inputValues}
              inputColors={inputColors}
              addDataTabsHandler={addDataTabsHandler}
              modeTabsHandler={modeTabsHandler}
              handleAddRoute={this.handleAddRoute}
              handleDeleteRoute={this.handleDeleteRoute}
              handleClickRoute={this.handleAddRouteFromDB}
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
                    statsColor={TRAFFIC_STATS}
                    textColor={TRAFFIC_COLOR}
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
              profiles={profiles}
              updatePoint={this.updatePoint}
              updateState={this.updateState}
              handleAddRoute={this.handleAddRoute}
              handleDeleteRoute={this.handleDeleteRoute}
              handleClickRoute={this.handleAddRouteFromDB}
              handleValueUpdate={this.handleValueUpdate}
              handleShowClick={this.handleShowClick}
              routingGraphVisible={routingGraphVisible}
              polygonsVisible={polygonsVisible}
              geographies={geographies}
              profile={profile}
              urlMatchString={urlMatchString}
              googleMapsOption={googleMapsOption}
              trafficOption={trafficOption}
              debug={debug}
              modeTabsHandler={modeTabsHandler}
              inputValues={inputValues}
              inputColors={inputColors}
              addDataTabsHandler={addDataTabsHandler}
              addedRoutes={addedRoutes}
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
        {(routeMessage || googleMessage || trafficMessage) && (
          <StyledBox align="center" bottom={messageBottomProp}>
            {routeMessage && <Message message={routeMessage} />}
            {trafficMessage && <Message message={trafficMessage} />}
            {googleMessage && <Message message={googleMessage} />}
          </StyledBox>
        )}
      </AppWrapper>
    )
  }
}

export default App
