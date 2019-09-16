import React, { Fragment } from 'react'
import { Modal, Label } from 'semantic-ui-react'
import styled from 'styled-components'
import { StyledButton, Box } from '../styledComponents'
import { MAIN_PETROL as COLOR } from '../utils/colours'
import TextAreaInput from './TextAreaInput'
import ModalHOC from './ModalHOC'
import { UpdateState, HandleValueUpdate, HandleConfirmButton, InputValues, InputColors } from '../types'

interface Props {
  id: string
  open: boolean
  setState: any
  updateState: UpdateState
  handleValueUpdate?: HandleValueUpdate
  handleConfirmButton?: HandleConfirmButton
  setInputRef?: (ref: any) => void
  editable: boolean
  buttonText: string
  title: string
  inputValues: InputValues,
  inputColors: InputColors
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
      setInputRef,
      handleValueUpdate,
      handleConfirmButton,
      updateState,
      editable,
      buttonText,
      title,
      inputValues,
      inputColors
    } = props

    return (
      <Fragment>
        <StyledModalHeader>{title}</StyledModalHeader>
        <StyledModalContents>
          <TextAreaInput
            id={id}
            editableValue={inputValues[id]}
            rows={15}
            setInputRef={setInputRef}
            handleValueUpdate={handleValueUpdate}
            handleInputChange={editable ? updateState : undefined}
            color={inputColors[id] || 'rgb(100, 100, 100)'}
            inputValues={inputValues}
          />
        </StyledModalContents>
        <Modal.Actions>
          <Box padding={'10px 20px'} direction="row" justify="flex-end">
            {inputColors[id] === 'red' && (
              <StyledLabel color="red">Invalid request body!</StyledLabel>
            )}
            <StyledButton
              backgroundcolor={COLOR}
              alignend
              onClick={() => handleConfirmButton && handleConfirmButton(setState, inputValues[id], '')}
            >
              {buttonText}
            </StyledButton>
          </Box>
        </Modal.Actions>
      </Fragment>
    )
}

export default process.env.NODE_ENV === 'test' ? EditDataInput : ModalHOC(EditDataInput)
