import React, { Component } from 'react'
import {
  Box,
  Button,
  Collapsible,
  Heading,
  Grommet,
  ResponsiveContext,
  Layer
} from 'grommet'
import Map from './Map'
import { Notification, FormClose } from 'grommet-icons'
import styled from 'styled-components'

const theme = {
  global: {
    colors: {
      brand: '#228BE6'
    },
    font: {
      family: 'Roboto',
      size1: '20px',
      height: '20px'
    }
  }
}

const StyledButton = styled(Button)`
  border-radius: 20px;
`

const AppBar = props => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="xlarge"
    style={{ zIndex: '1' }}
    {...props}
  />
)

class App extends Component {
  state = {
    showSidebar: false
  }

  render() {
    const { showSidebar } = this.state

    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>{() => <Map />}</ResponsiveContext.Consumer>
      </Grommet>
    )
  }
}

export default App
