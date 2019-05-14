import React, { Component } from 'react'
import styled from 'styled-components'

const PanelWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  width: 40%;
  height: 90%;
  left: 50px;
  top: 5%;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 6px;
`

export default class Panel extends Component {
  render() {
    return <PanelWrapper />
  }
}
