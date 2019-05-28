import React from 'react'
import styled from 'styled-components'
import { Box } from '../styledComponents'
import { Icon, Label } from 'semantic-ui-react'
import { UpdateState, Geography } from '../types'
import { PETROL_5 } from '../utils/colours'

interface Props {
  geography: Geography, 
  geographies: Array<Geography>, 
  width?: string,
  updateState: UpdateState,
}

const StyledIcon = styled(Icon)`
  cursor: pointer;
`

const StyledLabel = styled(Label)`
  cursor: pointer;
  &.ui.label {
    background-color: ${PETROL_5};
    color: white;
  }
`

const getNewProfile = (geographies: Array<Geography>, geography: Geography, left: boolean) => {
  const index = geographies.findIndex(el => el.name === geography.name)
  const lastIndex = geographies.length - 1
  return left ? index === 0 ? geographies[lastIndex] : geographies[index - 1] : 
    index === lastIndex ? geographies[0] : geographies[index + 1]
}

const ProfileToggler = ({ geography, geographies, width, updateState }: Props) => {
  return (
    <Box 
      direction="row" 
      justify="space-around" 
      padding="0 0 0 0" 
      height="45px"
      width={width}
    >
      <Box 
        width='10%' 
        onClick={() => updateState('geography', getNewProfile(geographies, geography, true))}
      >
        <StyledIcon color="grey" size="large" name={'angle left'}/>
      </Box>
      <Box width='60%'><StyledLabel onClick={() => updateState('recenter', true)} inverted size="large">{geography.name}</StyledLabel></Box>
      <Box 
        width='10%'
        onClick={() => updateState('geography', getNewProfile(geographies, geography, false))}
      >
        <StyledIcon color="grey" size="large" name={'angle right'}/>
      </Box>
    </Box>
  )
}

export default ProfileToggler
