import React, { Component } from 'react'
import styled from 'styled-components'
import { Input } from 'semantic-ui-react'
import { UpdatePoint } from '../types'


interface Props {
  updatePoint: UpdatePoint,
  rowKey: string
}

const StyledInput: typeof Input = styled(Input as any)`

  width: 100%;

  &.ui.input > input {
    border-radius: 7px;
    border: none;
    height: 40px;
    background-color: rgb(240, 240, 240)
  }
` as any

class ControlledInput extends Component<Props, any> {

  state = {
    value: ''
  }

  handleChange = (value: string): void => {
    this.setState({ value })
  }

  handleBlur = (): void => {
    const { value } = this.state
    const { rowKey, updatePoint } = this.props

    updatePoint(rowKey, value)

  }

  public render(){

    const { value } = this.state

    return (
      <StyledInput 
        fluid
        value={value} 
        onChange={(e, { value }) => this.handleChange(value)}
        onBlur={this.handleBlur}
      />
    )
  }
}

export default ControlledInput