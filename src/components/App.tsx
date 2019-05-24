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
      point: null
    }, { 
      name: 'end', 
      marker: 'flag checkered',
      placeholder: 'Destination',
      point: null
    }]
  }

  updatePoint: UpdatePoint = (index, value) => {
    this.setState(state => {
      let newLocations = [...state.locations]
      newLocations[index].point = value
      return {
        locations: newLocations
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
        <Map />
      </AppWrapper>
    )
  }
}

export default App
