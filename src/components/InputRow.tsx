import React, { Component } from 'react'
import { Box, StyledIcon, Circle } from '../styledComponents'
import ControlledInput from './ControlledInput'
import { UpdatePoint } from '../types'
import { PETROL_4, PETROL_2 } from '../utils/colours'


interface Props {
  rowKey: string,
  placeholder: string,
  iconName: string | any,
  updatePoint: UpdatePoint
}

const diameter = 38

class InputRow extends Component<Props, any> {

  constructor(props: Props) {
    super(props)
    this.state = {
      color: PETROL_2
    }
  }

  updateColor = () => {
    this.setState((state: any) => ({ color: state.color === PETROL_2 ? PETROL_4 : PETROL_2 }))
  }

  public render() {

    const { iconName, rowKey, updatePoint, placeholder } = this.props
    const { color } = this.state

    return (
      <Box direction="row" justify="space-around" padding="10px 0">
        <Circle diameter={diameter} color={color} margin="0 10px 0 0" position="relative">
          <Box height="100%" padding={`${Math.round(diameter / 2)}px`}>
            <StyledIcon 
              padding="0 0 0 0" 
              overridecolor={'white'} 
              name={iconName}
              size="large"
              position="absolute"
            />
          </Box>
        </Circle>
        <ControlledInput 
          rowKey={rowKey} 
          updatePoint={updatePoint}
          updateColor={this.updateColor}
          placeholder={placeholder}
        />
      </Box>
    )
  }
}

export default InputRow