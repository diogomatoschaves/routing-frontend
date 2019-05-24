import React, { Component } from 'react'
import styled from 'styled-components'
import { Input } from 'semantic-ui-react'
import { UpdatePoint, UpdateColor } from '../types'


interface Props {
  updatePoint: UpdatePoint,
  updateColor: UpdateColor,
  rowKey: string,
  index: number,
  placeholder: string
}

const StyledInput: typeof Input = styled(Input as any)`

  width: 100%;

  &.ui.input > input {
    border-radius: 7px;
    border: none;
    height: 43px;
    background-color: rgb(242, 242, 242);

    &:focus {
      background-color: rgb(248, 248, 248);
    }
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
    const { index, updatePoint, updateColor} = this.props

    updatePoint(index, value)
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