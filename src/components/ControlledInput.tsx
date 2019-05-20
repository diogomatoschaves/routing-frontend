import React, { Component } from 'react'
import styled from 'styled-components'
import { Input } from 'semantic-ui-react'
import { UpdatePoint, UpdateColor } from '../types'


interface Props {
  updatePoint: UpdatePoint,
  updateColor: UpdateColor,
  rowKey: string,
  placeholder: string
}

const StyledInput: typeof Input = styled(Input as any)`

  width: 100%;

  &.ui.input > input {
    border-radius: 7px;
    border: none;
    height: 45px;
    background-color: rgb(242, 242, 242)
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
    const { rowKey, updatePoint, updateColor} = this.props

    updatePoint(rowKey, value)
    updateColor()
  }

  public render(){

    const { value } = this.state
    const { placeholder, updateColor } = this.props

    return (
      <StyledInput 
        fluid
        value={value} 
        onChange={(e, { value }) => this.handleChange(value)}
        onBlur={this.handleBlur}
        onFocus={updateColor}
        placeholder={placeholder}
      />
    )
  }
}

export default ControlledInput