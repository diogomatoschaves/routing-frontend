import React from 'react'
import styled from 'styled-components'
import { Box } from '../styledComponents'
import { Checkbox, Label } from 'semantic-ui-react'
import { UpdateState } from '../types'


const StyledText = styled.label`
  width: 75%;
  margin: 0;
  padding-left: 15px;
  font-size: 14px;
  color: rgb(110, 110, 110) !important;
  font-weight: 200;
`
const StyledCheckbox = styled(Checkbox)`
  width: 25%;
  &.ui.checked.fitted.toggle.checkbox input:checked~label:before {
    background-color: #79aebf !important;
  }
`

interface Props {
  checked: boolean,
  text: string | typeof Label,
  id: string,
  updateState: UpdateState,
  width?: string
}


const OptionsSwitch = ({ checked, text, id, updateState, width }: Props) => {
  return (
    <Box direction="row" height="50px" width={width ? width : undefined}>
      <StyledCheckbox 
        id={id}
        className="custom-class"
        checked={checked} 
        onChange={(e: any, { checked }: { checked: boolean }) => updateState(id, checked)}
        toggle
      />
      <StyledText>{text}</StyledText>
    </Box>
  )
}

export default OptionsSwitch
