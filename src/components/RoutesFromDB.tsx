import { debounce } from 'lodash'
import React, { Component } from 'react'
import { Transition } from 'semantic-ui-react'
import { fetchRouteDB } from '../apiCalls'
import { Box, StyledText } from '../styledComponents'
import {
  HandleConfirmButton,
  HandleDeleteRoute,
  ResponseDB,
  Route as RouteType
} from '../types'
import { routeConverter } from '../utils/routeAdapter'
import Route from './Route'
import SearchInput from './SearchInput'

interface State {
  value: string
  message: string
  routes: RouteType[]
  addedRouteIds: string[]
}

interface Props {
  handleClickRoute: HandleConfirmButton
  handleDeleteRoute: HandleDeleteRoute
  setState: any
  addedRoutes: RouteType[]
}

export default class RoutesFromDB extends Component<Props, State> {
  public inputRef: any

  constructor(props: Props) {
    super(props)
    this.state = {
      addedRouteIds: [],
      message: '',
      routes: [],
      value: ''
    }
    this.fetchResults = debounce(this.fetchResults, 400)
    this.setInputRef = this.setInputRef.bind(this)
  }

  public componentDidMount() {
    if (process.env.NODE_ENV === 'test') {
      return
    }
    this.inputRef && this.inputRef.focus()
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { addedRoutes } = this.props
    if (prevProps.addedRoutes !== addedRoutes) {
      this.setState({ addedRouteIds: addedRoutes.map(route => route.id) })
    }
  }

  public setInputRef(ref: any) {
    this.inputRef = ref
  }

  public setValue = (value: string) => {
    this.setState({ value })
    if (value === '') {
      this.setState({ routes: [] })
    }
  }

  public fetchResults = (value: string) => {
    if (value !== '') {
      fetchRouteDB(value)
        .then((response: ResponseDB) => {
          if (response.exists) {
            const routes = routeConverter(response.routes)
            this.setState({ routes })
          } else {
            this.setState({ message: 'Route not found.', routes: [] })
          }
        })
        .catch(() =>
          this.setState({ message: 'There was a problem fetching the route.' })
        )
    } else {
      this.setState({ routes: [] })
    }
  }

  public handleClick = (route: RouteType) => {
    const { handleClickRoute, setState } = this.props
    handleClickRoute(setState, route, '')
  }

  public render() {
    const { value, routes, message, addedRouteIds } = this.state
    const { handleDeleteRoute } = this.props

    return (
      <Box
        direction="column"
        justify="flex-start"
        width="100%"
        align="center"
        padding="10px 0 0 0"
      >
        <Box direction="row" justify="center" align="center" width="90%">
          <Box direction="row" justify="center" width="100%">
            <SearchInput
              value={value}
              fetchResults={this.fetchResults}
              setValue={this.setValue}
              setInputRef={this.setInputRef}
            />
          </Box>
        </Box>
        <Transition.Group
          as={Box}
          width="90%"
          padding="20px 0 0 0"
          animation={'fade'}
          duration={300}
        >
          {routes.length > 0 ? (
            routes.map((route: RouteType) => {
              const added = addedRouteIds.includes(route.id)
              return (
                <Route
                  key={route.id}
                  route={route}
                  addRoute={!added ? this.handleClick : undefined}
                  deleteRoute={added ? handleDeleteRoute : undefined}
                  buttonText={added ? 'Remove' : 'Add'}
                  buttonColor={added ? 'red' : 'green'}
                />
              )
            })
          ) : (
            <StyledText>{message}</StyledText>
          )}
        </Transition.Group>
      </Box>
    )
  }
}
