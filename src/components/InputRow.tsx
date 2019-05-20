import React from 'react'
import styled from 'styled-components'
import { Box, StyledIcon } from '../styledComponents'
import ControlledInput from './ControlledInput'
import { Input } from 'semantic-ui-react'
import { PETROL_4 } from '../utils/colours'
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
      <StyledIcon 
        paddingright="12" 
        overridecolor={props.color} 
        name={props.iconName}
        size="large"
      />
      <ControlledInput rowKey={props.rowKey} updatePoint={props.updatePoint}/>
    </Box>
  )
}

export default InputRow