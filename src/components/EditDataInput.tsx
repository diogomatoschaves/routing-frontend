import React, { Fragment } from 'react'
import { Modal, Label } from 'semantic-ui-react'
import styled from 'styled-components'
import { StyledButton, Box } from '../styledComponents'
import { MAIN_PETROL as COLOR } from '../utils/colours'
import TextAreaInput from './TextAreaInput'
import ModalHOC from './ModalHOC'
import { UpdateState, HandleChange, HandleConfirmButton } from '../types'

interface Props {
  id: string
  open: boolean
  setState: any
  value: string
  color: string
  updateState: UpdateState
  handleValueUpdate?: HandleChange
  handleAddRoute: HandleConfirmButton
  setInputRef?: (ref: any) => void
  editable: boolean
  buttonText: string
  title: string
}

const StyledLabel = styled(Label)`
  &.ui.label {
    margin-right: 20px;
  }
`

const StyledModalHeader = styled(Modal.Header)`
  &.ui.modal > .header {
    font-family: "BasisGrotesque Medium", Lato !important;
  }
`

const StyledModalContents = styled(Modal.Content)`
  min-height: 450px;
`

function EditDataInput (props: Props) {

    const {
      id,
      setState,
      value,
      setInputRef,
      color,
      handleValueUpdate,
      handleAddRoute,
      updateState,
      editable,
      buttonText,
      title
    } = props

    return (
      <Fragment>
        <StyledModalHeader>{title}</StyledModalHeader>
        <StyledModalContents>
          <TextAreaInput
            id={id}
            editableValue={value}
            rows={15}
            setInputRef={setInputRef}
            handleValueUpdate={handleValueUpdate}
            handleInputChange={editable ? updateState : undefined}
            color={color}
          />
        </StyledModalContents>
        <Modal.Actions>
          <Box padding={'10px 20px'} direction="row" justify="flex-end">
            {color === 'red' && (
              <StyledLabel color="red">Invalid route response!</StyledLabel>
            )}
            <StyledButton
              backgroundcolor={COLOR}
              alignend
              onClick={() => handleAddRoute(setState, value)}
            >
              {buttonText}
            </StyledButton>
          </Box>
        </Modal.Actions>
      </Fragment>
    )
}

export default ModalHOC(EditDataInput)
