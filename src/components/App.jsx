import React, { Component } from 'react'
import { Box, Button, Grommet, ResponsiveContext } from 'grommet'
import styled from 'styled-components'
import Map from './Map'
import Panel from './Panel'

const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`

class App extends Component {
  state = {
    // showSidebar: false
  }

  render() {
    return (
      <AppWrapper>
        <Panel />
        <Map />
      </AppWrapper>
    )
  }
}

export default App
