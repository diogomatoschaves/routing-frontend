import React, { Component } from 'react'
import { Box, StyledIcon, ColoredDiv } from '../styledComponents'
import ControlledInput from './ControlledInput'
import { UpdatePoint, Coords } from '../types'
import { NORMAL_INPUT, FOCUSED_INPUT } from '../utils/colours'


interface Props {
  rowKey: string,
  index: number,
  coords: Coords,
  placeholder: string,
  iconName: string | any,
  updatePoint: UpdatePoint
}

const diameter = 38

class InputRow extends Component<Props, any> {

  constructor(props: Props) {
    super(props)
    this.state = {
      color: NORMAL_INPUT
    }
  }

  updateColor = () => {
    this.setState((state: any) => ({ color: state.color === NORMAL_INPUT ? FOCUSED_INPUT : NORMAL_INPUT }))
  }

  public render() {

    const { iconName, rowKey, index, coords, updatePoint, placeholder } = this.props
    const { color } = this.state

    return (
      <Box direction="row" justify="space-around" padding="10px 0">
        <ColoredDiv circle diameter={diameter} color={color} margin="0 10px 0 0" position="relative">
          <Box height="100%" padding={`${Math.round(diameter / 2)}px`}>
            <StyledIcon 
              fontSize={'25px'}
              height={'20px'}
              padding="0 0 0 0" 
              overridecolor={'white'} 
              name={iconName}
              position="absolute"
            />
          </Box>
        </ColoredDiv>
        <ControlledInput 
          rowKey={rowKey}
          index={index}
          coords={coords}
          updatePoint={updatePoint}
          updateColor={this.updateColor}
          placeholder={placeholder}
        />
      </Box>
    )
  }
}

export default InputRow