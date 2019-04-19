import React, { Component } from "react"
import { Grommet, Box, Button } from "grommet"
import styled from "styled-components"

const theme = {
  global: {
    colors: {
      brand: "#228BE6"
    },
    font: {
      family: "Roboto",
      size: "20px",
      height: "20px"
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
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="xlarge"
    style={{ zIndex: "1" }}
    {...props}
  />
)

class App extends Component {
  render() {
    const { option } = this.state

    return (
      <Grommet theme={theme}>
        <AppBar>Hello World!</AppBar>
        <StyledButton label="Edit" option={option} onClick={() => {}} />
      </Grommet>
    )
  }
}

export default App
