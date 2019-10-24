import React, { Fragment } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import styled, { css } from 'styled-components'
import { Box, StyledHeader } from '../styledComponents'
import {
  Body,
  GoogleResponse,
  HandleConfirmButton,
  HandleValueUpdate,
  InputColors,
  InputValues,
  MatchResponse,
  RouteResponse,
  UpdateState
} from '../types'
import { MAIN_PETROL } from '../utils/colours'
import EditDataInput from './EditDataInput'
import RecursiveJSONProperty from './RecursiveJSONProperty'

interface Props {
  id: string
  buttonId: string
  buttonText: string
  value: RouteResponse | MatchResponse | GoogleResponse | Body
  inputValues: InputValues
  inputColors: InputColors
  updateState: UpdateState
  handleValueUpdate?: HandleValueUpdate
  handleConfirmButton?: HandleConfirmButton
  className: string
  text: string
  edit: boolean
  editable: boolean
  title: string
}

const StyledButton = styled(Button)`
  &.ui.button {
    padding: 7px;
    ${props =>
      props.marginleft &&
      css`
        margin-left: ${props.marginleft};
      `}
    &.icon {
      background-color: ${MAIN_PETROL};
      color: white;
      padding: 7px;
    }
  }
`

export default function JsonBlock({
  id,
  buttonId,
  buttonText,
  value,
  className,
  text,
  inputValues,
  inputColors,
  edit,
  updateState,
  handleValueUpdate,
  handleConfirmButton,
  editable,
  title
}: Props) {
  return (
    <Fragment>
      <Box direction="row" justify="flex-start">
        <StyledHeader overridecolor={MAIN_PETROL}>{text}</StyledHeader>
        <StyledButton
          id={buttonId}
          onClick={() => updateState(buttonId, !edit)}
          marginleft={'10px'}
          icon={edit}
          className={className}
        >
          {edit ? <Icon name={'check'} /> : editable ? 'Edit' : 'View source'}
        </StyledButton>
      </Box>
      <Box width="100%" direction="row" justify="flex-start">
        <RecursiveJSONProperty
          property={value}
          propertyName=""
          excludeBottomBorder={true}
          rootProperty={true}
          expanded={true}
        />
      </Box>
      <EditDataInput
        id={id}
        open={edit}
        setState={(newValue: boolean) => updateState(buttonId, newValue)}
        updateState={updateState}
        handleValueUpdate={handleValueUpdate}
        handleConfirmButton={handleConfirmButton}
        inputValues={inputValues}
        inputColors={inputColors}
        editable={editable}
        buttonText={buttonText}
        title={title}
      />
    </Fragment>
  )
}
