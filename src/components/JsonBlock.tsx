import React, { Fragment, useState } from 'react'
import styled, { css } from 'styled-components'
import { MAIN_PETROL } from '../utils/colours'
import { Button, Icon } from 'semantic-ui-react'
import { Body, RouteResponse, MatchResponse, HandleChange, UpdateState, HandleConfirmButton, GoogleResponse } from '../types'
import TextAreaInput from './TextAreaInput'
import { Box, StyledHeader } from '../styledComponents'
import RecursiveJSONProperty from './RecursiveJSONProperty';
import EditDataInput from './EditDataInput';

interface Props {
  id: string
  colorId: string
  buttonId: string
  buttonText: string
  value: RouteResponse | MatchResponse | GoogleResponse | Body
  editableValue: string
  updateState: UpdateState
  handleValueUpdate?: HandleChange
  handleConfirmButton?: HandleConfirmButton
  className: string
  text: string
  edit: boolean
  editable: boolean
  color?: string
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
  colorId,
  buttonId,
  buttonText,
  value,
  className,
  text,
  editableValue,
  edit,
  updateState,
  handleValueUpdate,
  handleConfirmButton,
  editable,
  color,
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
        colorId={colorId}
        open={edit}
        setState={(value: boolean) => updateState(buttonId, value)}
        updateState={updateState}
        handleValueUpdate={handleValueUpdate}
        handleAddRoute={handleConfirmButton}
        value={editableValue}
        editable={editable}
        color={color}
        buttonText={buttonText}
        title={title}
      />
    </Fragment>
  )
}