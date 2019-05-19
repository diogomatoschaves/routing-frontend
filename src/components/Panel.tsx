import React, { Component } from 'react'
import styled from 'styled-components'
import Input from 'antd/lib/input'

// const StyledInput = styled(Input)`
const StyledInput: typeof Input = styled(Input as any)`
  &.ant-input{
    border-radius: 7px
    height: 40px;
  }
` as any

const PanelWrapper: any = styled.div`
  position: absolute;
  z-index: 1000;
  width: 30%;
  max-width: 600px;
  height: 250px;
  /* max-height: 200px;
  ma-height: 200px; */
  left: 20px;
  top: 20px;
  padding: 30px;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 6px;
`

export default class Panel extends Component<any, any>{
  render() {
    return (
      <PanelWrapper >
        <StyledInput/>
      </PanelWrapper>
    )
  }
}
