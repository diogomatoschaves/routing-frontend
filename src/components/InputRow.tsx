import React from 'react'
import styled from 'styled-components'
import { Box, StyledIcon, Circle } from '../styledComponents'
import ControlledInput from './ControlledInput'
import { UpdatePoint } from '../types'

interface Props {
  rowKey: string,
  color: string,
  iconName: string | any,
  updatePoint: UpdatePoint
}

const InputRow: any = (props: Props) => {
  return (
    <Box direction="row" justify="space-around" padding="10px 0">
      <Circle diameter="38" color={props.color} margin="0 7px 0 0" position="relative">
        <Box height="100%">
          <StyledIcon 
            padding="0 0 0 0" 
            overridecolor={'white'} 
            name={props.iconName}
            size="large"
            position="absolute"
          />
        </Box>
      </Circle>
      <ControlledInput rowKey={props.rowKey} updatePoint={props.updatePoint}/>
    </Box>
  )
}

export default InputRow