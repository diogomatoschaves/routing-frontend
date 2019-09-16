import React from 'react'
import styled from 'styled-components'
import { Box } from '../styledComponents'
import { Icon, Label } from 'semantic-ui-react'
import { UpdateState, Geography, Option } from '../types'
import { PETROL_5 } from '../utils/colours'

interface Props {
  selectedOption: Geography | Option
  optionsArray: Array<Geography> | Array<Option>
  width?: string
  updateState: UpdateState
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
  optionsArray: Array<Geography> | Array<Option>,
  option: Geography | Option,
  left: boolean
) => {
  const index = optionsArray.findIndex((el: Geography | Option) => el.value === option.value)
  const lastIndex = optionsArray.length - 1
  return left
    ? index === 0
      ? optionsArray[lastIndex]
      : optionsArray[index - 1]
    : index === lastIndex
    ? optionsArray[0]
    : optionsArray[index + 1]
}

const handleClick = (
  optionsArray: Array<Geography> | Array<Option>,
  selectedOption: Geography | Option,
  updateState: UpdateState,
  id: string,
  left: boolean
) => {

  const newOptionsArray = {
    options: optionsArray,
    activeIdx: getNewProfile(optionsArray, selectedOption, left).value
  }

  updateState(
    id,
    newOptionsArray
  )
}

const ProfileToggler = ({
  selectedOption,
  optionsArray,
  width,
  updateState,
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
        left
        onClick={() =>
          handleClick(optionsArray, selectedOption, updateState, id, true)
        }
      >
        <StyledIcon color="grey" size="large" name={'angle left'} />
      </Box>
      <Box width="60%">
        <StyledLabel onClick={() => optionsArray && updateState('recenter', true)} size="large">
          {selectedOption.text}
        </StyledLabel>
      </Box>
      <Box
        width="10%"
        right
        onClick={() =>
          handleClick(optionsArray, selectedOption, updateState, id, false)
        }
      >
        <StyledIcon color="grey" size="large" name={'angle right'} />
      </Box>
    </Box>
  )
}

export default ProfileToggler
