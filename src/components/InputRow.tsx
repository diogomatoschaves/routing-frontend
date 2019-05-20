import React from 'react'
import styled from 'styled-components'
import { Box, StyledIcon } from '../styledComponents'
import { Input } from 'semantic-ui-react'
import { PETROL_4 } from '../utils/colours'

interface Props {
  color: string,
  iconName: string | any
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

const InputRow: any = (props: Props) => {
  return (
    <Box direction="row" justify="space-around" padding="10px 0">
      <StyledIcon 
        paddingright="12" 
        overridecolor={props.color} 
        name={props.iconName}
        size="large"
      />
      <StyledInput fluid/>
    </Box>
  )
}

export default InputRow