import { History } from 'history'
import { Base64 } from 'js-base64'
import JSON5 from 'json5'
import { Validator } from 'jsonschema'
import React, { Component, Fragment } from 'react'
import { Button, Icon, Menu, Segment, Sidebar, Transition } from 'semantic-ui-react'
import styled, { css } from 'styled-components'
import { auth, googleDirections, osrmRoutingApi, routingApi } from '../apiCalls'
import '../App.css'
import Map from './Map'
import { Box, EmptySpace } from '../styledComponents'
import {
  Body,
  GeographiesHandler,
  GetRoutes,
  GoogleResponse,
  HandleConfirmButton,
  HandleDeleteRoute,
  HandleValueUpdate,
  InputColors,
  InputValues,
  Location,
  LocationInfo,
  Messages,
  OptionsHandler, OSRMRouteResponse,
  ResponseOptionsHandler,
  Responses,
  Route,
  RouteResponse,
  Routes,
  UpdatePoint,
  UpdateState,
  UpdateStateCallback,
  WaitTillLoaded
} from '../types'
import {
  PETROL_6,
  ROUTING_SERVICE_POLYLINE,
  THIRD_PARTY_POLYLINE,
  TRAFFIC_POLYLINE
} from '../utils/colours'
import {
  capitalize,
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
  routeConverterFromMatchService, routeConverterFromOSRM,
  routeConverterFromRouteService
} from '../utils/routeAdapter'
import { Schema } from '../utils/schemas'
import {
  extractQueryParams,
  getSettingsFromUrl,
  getUrlParamsDiff,
  mapOptionalParameters,
  optionalParamsMapping,
  requiredParams,
  updateUrl
} from '../utils/urlConfig'
import InspectPanel from './InspectPanel'
import Message from './Message'
import Panel from './Panel'
import RoutesInfoContainer from './RoutesInfoContainer'
import TrafficLegend from './TrafficLegend'

interface State {
  validator?: Validator
  recalculate: boolean
  locations: LocationInfo[]
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
  loading: boolean
  [key: string]: any
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

const messageFailedRoute = (traffic: boolean, response: OSRMRouteResponse) => (
  <span>
    <span style={{ color: traffic ? TRAFFIC_POLYLINE : ROUTING_SERVICE_POLYLINE }}>
      OSRM {traffic ? ' - traffic' : ''}:
    </span>
    <span> {response.code}. </span>
    <span style={{ color: traffic ? TRAFFIC_POLYLINE : ROUTING_SERVICE_POLYLINE }}>
      An error occurred while fetching the route.
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

  public propsToReset = new Set(['bearing', 'radius'])

  public getAuth = async () => {
    if (process.env.NODE_ENV !== 'production') {
      const password = process.env.REACT_APP_LDAP_PASSWORD
      const username = process.env.REACT_APP_LDAP_USERNAME
      return `Basic ${Base64.encode(`${username}:${password}`)}`
    } else {
      return auth(process.env.REACT_APP_URL || '').then(jsonifiedResponse => {
        return jsonifiedResponse.basicAuth
      })
    }
  }

  public listenHistory = (history: History) => {
    return history.listen((location: any, action: any) => {
      if (action === 'POP') {
        const { endpointHandler, locations, profile } = this.state
        const { profiles, match } = this.props

        const queryParams = extractQueryParams(location.search)

        getSettingsFromUrl(
          queryParams,
          locations,
          profile,
          match.params,
          endpointHandler,
          profiles,
          true,
          history,
          location,
          this.waitTillLoaded
        ).then((urlSettings: any) => {
          this.setState(urlSettings)
        })
      }
    })
  }

  public async componentDidMount() {
    const { windowProp, match, location, history, loadedProp, profiles } = this.props
    const { validator, responses, body, locations, endpointHandler, profile } = this.state

    const unlisten = this.listenHistory(history)

    this.getAuth().then(authorization => {
      this.setState({ authorization }, () => {
        this.addGoogleObject(windowProp).then(() => {
          const queryParams = extractQueryParams(location.search)

          getSettingsFromUrl(
            queryParams,
            locations,
            profile,
            match.params,
            endpointHandler,
            profiles,
            loadedProp,
            history,
            location,
            this.waitTillLoaded
          ).then((urlSettings: any) => {
            const urlQueryParams = mapOptionalParameters(
              optionalParamsMapping,
              queryParams
            )
            updateUrl(
              locations,
              profile,
              endpointHandler.options[endpointHandler.activeIdx].key,
              history,
              location,
              urlQueryParams
            )
            this.setState(urlSettings)
          })
        })
      })
    })

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
  }

  public componentDidUpdate(prevProps: any, prevState: State) {
    const {
      mapLoaded,
      locations,
      authorization,
      profile,
      googleMapsOption,
      google,
      trafficOption,
      polygonsVisible,
      routingGraphVisible,
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

    const { history, location, defaultColor } = this.props

    if (mapLoaded !== prevState.mapLoaded && mapLoaded) {
      this.setState(
        {
          polygonsVisible: false,
          routingGraphVisible: false
        },
        () => {
          this.setState({
            polygonsVisible,
            routingGraphVisible
          })
        }
      )
    }

    if (
      prevState.locations !== locations ||
      prevState.profile !== profile ||
      prevState.endpointHandler.activeIdx !== endpointHandler.activeIdx ||
      Object.values(optionalParamsMapping).some(
        (paramKey: string | boolean | undefined) => {
          // @ts-ignore
          return this.state[paramKey] !== prevState[paramKey]
        }
      )
    ) {
      const urlOptionalParams = this.getCurrentPrevious(
        optionalParamsMapping,
        this.state,
        prevState
      )

      const urlParams = this.getCurrentPrevious(requiredParams, this.state, prevState)

      const diff = getUrlParamsDiff(
        urlParams.current,
        urlParams.prev,
        urlOptionalParams.current,
        urlOptionalParams.prev
      )
      const defaultOption =
        (diff.profile || diff.locations || diff.endpointHandler) && true

      if (recalculate) {
        this.setState({ loading: true }, () => {
          this.getRoutes(
            locations,
            profile,
            authorization,
            (diff.googleMapsOption &&
              !(diff.endpointHandler && !diff.locations && !diff.profile)) ||
              false,
            google,
            diff.trafficOption || false,
            defaultOption || false,
            endpointHandler.options[endpointHandler.activeIdx].text
          ).finally(() => this.setState({ loading: false }))
        })
      } else {
        this.updateState('recalculate', true)
      }

      const mappedQueryParams = mapOptionalParameters(
        optionalParamsMapping,
        urlOptionalParams.current
      )

      updateUrl(
        locations,
        profile,
        endpointHandler.options[endpointHandler.activeIdx].key,
        history,
        location,
        mappedQueryParams
      )
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

    if (prevState.profile !== profile) {
      this.setState(state => ({
        ...state,
        responses: {
          ...state.responses,
          googleResponse: defaultGoogleResponse,
          routeResponse: defaultRouteResponse,
          trafficResponse: defaultRouteResponse
        }
      }))
    }

    if (prevState.trafficOption !== trafficOption && !trafficOption) {
      this.setState(state => ({
        ...state,
        responses: {
          ...state.responses,
          trafficResponse: defaultRouteResponse
        }
      }))
    }

    if (prevState.googleMapsOption !== googleMapsOption && !googleMapsOption) {
      this.setState(state => ({
        ...state,
        responses: {
          ...state.responses,
          googleResponse: defaultGoogleResponse
        }
      }))
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

  public waitTillLoaded: WaitTillLoaded = loadedProp => {
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

  public getRoutes: GetRoutes = (
    locations: LocationInfo[],
    profile: string,
    authorization: string,
    googleMapsOption: boolean,
    google: any,
    trafficOption: boolean,
    defaultOption: boolean,
    endpointUrl: string
  ) => {
    if (
      locations.length >= 2 &&
      !locations.some((el: LocationInfo) => !el.lat || !el.lon)
    ) {
      const body = getRequestBody(locations)

      this.setState({ body })

      return Promise.all([
        defaultOption && this.handleOSRMRequest(profile, locations, endpointUrl, 'route'),
        trafficOption &&
          ['car'].includes(profile) &&
          this.handleOSRMRequest('car-traffic', locations, endpointUrl, 'traffic'),
        googleMapsOption &&
          google &&
          ['car', 'foot'].includes(profile) &&
          this.handleGoogleRequest(google, profile, locations)
      ])
    } else {
      return Promise.all([])
    }
  }

  public handleOSRMRequest = async (
    profile: string,
    locations: Location[],
    endpointUrl: string,
    routeName: string
  ) => {
    const response = `${routeName}Response`
    const message = `${routeName}Message`

    return new Promise(resolve => {
      osrmRoutingApi(locations, profile)
        .then((routeResponse: OSRMRouteResponse) => {
          this.setState(
            state => ({
              messages: {
                ...state.messages,
                [message]: null
              },
              responses: {
                ...state.responses,
                [response]: routeResponse
              }
            }),
            () => resolve()
          )
        })
        .catch(() => {
          this.setState(
            state => ({
              messages: {
                ...state.messages,
                [message]: (
                  <span style={{ color: 'red' }}>
                    There was an error fetching the route.
                  </span>
                )
              },
              responses: {
                ...state.responses,
                [response]: defaultRouteResponse
              },
              showMessage: true
            }),
            () => resolve()
          )
        })
    })
  }

  public handleGoogleRequest = (
    google: any,
    profile: string,
    locations: LocationInfo[]
  ) => {
    return new Promise(resolve => {
      googleDirections(google, profile, locations)
        .then((googleResponse: GoogleResponse) => {
          this.setState(
            state => ({
              messages: {
                ...state.messages,
                googleMessage: null
              },
              responses: {
                ...state.responses,
                googleResponse
              }
            }),
            () => resolve()
          )
        })
        .catch(() => {
          this.setState(
            state => ({
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
            }),
            () => resolve()
          )
        })
    })
  }

  public addGoogleObject = async (windowProp: boolean) => {
    if (!windowProp && !window.google) {
      return new Promise(resolve => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://maps.google.com/maps/api/js?key=${
          process.env.REACT_APP_GOOGLE_MAPS_TOKEN
        }`
        const head = document.getElementsByTagName('head')[0]
        head.appendChild(script)

        script.addEventListener('load', () => {
          this.setState({ google: window.google }, () => {
            resolve(window.google)
          })
        })
      })
    } else {
      await this.setState({ google: window.google || windowProp }, () => {
        return Promise.resolve(window.google)
      })
    }
  }

  public updatePoint: UpdatePoint = (indexes: number[], newLocations: Location[]) => {
    this.setState(state => {
      return {
        locations: state.locations.reduce(
          (accum: LocationInfo[], element: LocationInfo, currentIndex: number) => {
            if (!indexes.includes(currentIndex)) {
              return [...accum, element]
            } else {
              const index = indexes.findIndex(el => el === currentIndex)
              const resettedLocation = Object.keys(element).reduce(
                (newObj: any, prop) => {
                  return this.propsToReset.has(prop)
                    ? newObj
                    : {
                        ...newObj,
                        [prop]: element[prop]
                      }
                },
                {}
              )

              return [
                ...accum,
                {
                  ...resettedLocation,
                  ...newLocations[index]
                }
              ]
            }
          },
          []
        )
      }
    })
  }

  public updateRoute = (response: OSRMRouteResponse, key: string, routeName: string) => {
    if (Object.keys(response).includes('code') && response.code === 'Ok') {
      const route = routeConverterFromOSRM(response, key)
      this.setState(state => ({
        ...state,
        routes: {
          ...state.routes,
          [routeName]: route
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

  public updateStateCallback: UpdateStateCallback = async callback => {
    this.setState(callback, () => {
      return
    })
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

  public getCurrentPrevious: any = (fields: any, state: State, prevState: State) => {
    return Object.values(fields).reduce(
      (accum: any, paramKey) => {
        return {
          ...accum,
          current: {
            ...accum.current,
            // @ts-ignore
            [paramKey]: state[paramKey]
          },
          prev: {
            ...accum.prev,
            // @ts-ignore
            [paramKey]: prevState[paramKey]
          }
        }
      },
      {
        current: {},
        prev: {}
      }
    )
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
      inputColors,
      loading
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
            {!debug && <RoutesInfoContainer routes={routes} />}
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
              loading={loading}
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
