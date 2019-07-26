import React from 'react'
import styled from 'styled-components'
import { Box } from '../styledComponents'
import { Icon, Label } from 'semantic-ui-react'
import { UpdateState, Geography } from '../types'
import { PETROL_5 } from '../utils/colours'

interface Props {
  geography?: Geography
  geographies?: Array<Geography>
  width?: string
  updateState: UpdateState
  responseOption?: string
  id: string
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

const getNewProfile = (
  geographies: Array<Geography>,
  geography: Geography,
  left: boolean
) => {
  const index = geographies.findIndex(el => el.name === geography.name)
  const lastIndex = geographies.length - 1
  return left
    ? index === 0
      ? geographies[lastIndex]
      : geographies[index - 1]
    : index === lastIndex
    ? geographies[0]
    : geographies[index + 1]
}

const handleClick = (
  geographies: Array<Geography> | undefined,
  geography: Geography | undefined,
  updateState: UpdateState,
  id: string,
  responseOption: string | undefined
) => {
  updateState(
    id,
    geographies && geography
      ? getNewProfile(geographies, geography, true)
      : responseOption === 'normal'
      ? 'traffic'
      : 'normal'
  )
}

const names: any = {
  normal: 'No Traffic',
  traffic: 'Traffic'
}

const ProfileToggler = ({
  geography,
  geographies,
  width,
  updateState,
  responseOption,
  id
}: Props) => {
  return (
    <Box
      direction="row"
      justify="space-around"
      padding="0 0 0 0"
      height="45px"
      width={width}
    >
      <Box
        width="10%"
        onClick={() =>
          handleClick(geographies, geography, updateState, id, responseOption)
        }
      >
        <StyledIcon color="grey" size="large" name={'angle left'} />
      </Box>
      <Box width="60%">
        <StyledLabel onClick={() => geographies && updateState('recenter', true)} size="large">
          {geography
            ? geography.name
            : responseOption
            ? names[responseOption]
            : responseOption}
        </StyledLabel>
      </Box>
      <Box
        width="10%"
        onClick={() =>
          handleClick(geographies, geography, updateState, id, responseOption)
        }
      >
        <StyledIcon color="grey" size="large" name={'angle right'} />
      </Box>
    </Box>
  )
}

export default ProfileToggler
