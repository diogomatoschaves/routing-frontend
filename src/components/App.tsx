import React, { Component } from 'react'
import styled from 'styled-components'
import Map from './Map'
import Panel from './Panel'
import '../App.css'
import { UpdatePoint, Location } from '../types'

const AppWrapper: any = styled.div`
  width: 100vw;
  height: 100vh;
`

interface State {
  locations: Array<Location>
}

class App extends Component<any, State> {

  state = {
    locations: [{ 
      name: 'start', 
      marker: 'map marker alternate',
      placeholder: 'Origin',
      lat: null,
      lng: null
    }, { 
      name: 'end', 
      marker: 'flag checkered',
      placeholder: 'Destination',
      lat: null,
      lng: null
    }]
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

    const { locations } = this.state

    return (
      <AppWrapper>
        <Panel 
          locations={locations}
          updatePoint={this.updatePoint}
        />
        <Map 
          locations={locations}
          updatePoint={this.updatePoint}
        />
      </AppWrapper>
    )
  }
}

export default App
