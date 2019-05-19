import React, { Component } from 'react'
import styled from 'styled-components'
import Map from './Map'
import Panel from './Panel'
import '../App.css'
// import 'antd/dist/antd.css';

const AppWrapper: any = styled.div`
  width: 100vw;
  height: 100vh;
`

class App extends Component {
  
  state = {}

  public render() {

    return (
      <AppWrapper>
        <Panel />
        <Map />
      </AppWrapper>
    )
  }
}

export default App
