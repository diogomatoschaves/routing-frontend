import React, { Component } from 'react'
import styled from 'styled-components'
import Map from './Map'
import Panel from './Panel'
import '../App.css'
// import 'antd/dist/antd.css';
import { UpdatePoint } from '../types'

const AppWrapper: any = styled.div`
  width: 100vw;
  height: 100vh;
`

class App extends Component {

  state = {
    startPoint: null,
    endPoint: null,
  }

  updatePoint: UpdatePoint = (key, value) => {
    this.setState({ [`${key}Point`]: value})
  }

  public render() {

    const { startPoint, endPoint } = this.state

    return (
      <AppWrapper>
        <Panel 
          startPoint={startPoint} 
          endPoint={endPoint}
          updatePoint={this.updatePoint}
        />
        <Map />
      </AppWrapper>
    )
  }
}

export default App
