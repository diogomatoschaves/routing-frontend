import React, { Component } from 'react'
import styled from 'styled-components'
import Map from './Map'
import Panel from './Panel'
import { StyledSegment } from '../styledComponents'
import '../App.css'
import { UpdatePoint, Location, Response, Coords2 } from '../types'
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
  routePath?: Array<Coords2>
}

class App extends Component<any, State> {

  state = {
    authorization: '',
    routePath: [],
    response: {
      code: 'Ok',
      routes: [{ legs: [{ geometry: [] }]}],
      locations: []
    },
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

    const { locations, authorization, response } = this.state

    if (prevState.locations !== locations) {
      if (locations.length >= 2 && !locations.some((el: Location) => (!el.lat || !el.lng))) {
        routingApi('car', authorization, locations)
        .then((response: Response) => this.setState({ response }))        
      }
    }

    if (prevState.response !== response) {
      if (Object.keys(response).includes('code') && response.code == 'Ok') {
        const routePath = response.routes[0].legs[0].geometry
        this.setState({ routePath })
      }
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

  public render() {

    const { locations, routePath } = this.state

    return (
      <AppWrapper>
        {routePath && (
          <StyledSegment
            position="absolute"
            right="50px"
            bottom="50px"
            zindex={1000}
            width="300px"
            height="150px"
          />
        )}
        <Panel 
          locations={locations}
          updatePoint={this.updatePoint}
        />
        <Map 
          locations={locations}
          updatePoint={this.updatePoint}
          routePath={routePath}
        />
      </AppWrapper>
    )
  }
}

export default App
