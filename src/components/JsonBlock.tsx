import React, { Fragment, useState } from 'react'
import styled, { css } from 'styled-components'
import { MAIN_PETROL } from '../utils/colours'
import { Button, Icon } from 'semantic-ui-react'
import { Body, RouteResponse, MatchResponse, HandleValueUpdate, UpdateState, HandleConfirmButton, GoogleResponse, InputValues, InputColors } from '../types'
import { Box, StyledHeader } from '../styledComponents'
import RecursiveJSONProperty from './RecursiveJSONProperty';
import EditDataInput from './EditDataInput';

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
          onClick={(e: any, { id }: { id: string }) => updateState(buttonId, !edit)}
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
        setState={(value: boolean) => updateState(buttonId, value)}
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