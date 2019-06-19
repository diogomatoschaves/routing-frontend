import React, { Component } from 'react'
import { Box } from '../styledComponents'
import ControlledInput from './ControlledInput'
import BackgroundIcon from './BackgroundIcon'
import { UpdatePoint, Coords } from '../types'
import { NORMAL_INPUT, FOCUSED_INPUT } from '../utils/colours'


interface Props {
  rowKey: string,
  index: number,
  coords: Coords,
  placeholder: string,
  iconName: string | any,
  updatePoint: UpdatePoint,
  urlMatchString: string
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

    const { iconName, rowKey, index, coords, updatePoint, placeholder, urlMatchString } = this.props
    const { color } = this.state

    return (
      <Box direction="row" justify="space-around" padding="10px 0">
        <BackgroundIcon 
          diameter={diameter}
          color={color}
          iconColor={'white'}
          circle={true}
          iconName={iconName}
          margin={"0 10px 0 0"}
        />
        <ControlledInput 
          rowKey={rowKey}
          index={index}
          coords={coords}
          updatePoint={updatePoint}
          updateColor={this.updateColor}
          placeholder={placeholder}
          urlMatchString={urlMatchString}
        />
      </Box>
    )
  }
}

export default InputRow