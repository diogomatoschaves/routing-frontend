import React, { Fragment } from 'react'
import { Modal, Label } from 'semantic-ui-react'
import styled from 'styled-components'
import { StyledButton, Box } from '../styledComponents'
import { MAIN_PETROL as COLOR } from '../utils/colours'
import TextAreaInput from './TextAreaInput'
import ModalHOC from './ModalHOC'
import Tabs from './Tabs'
import { HandleChange, UpdateState, HandleConfirmButton, OptionsHandler } from '../types'

interface Props {
  id: string
  colorId: string
  open: boolean
  setState: any
  value: string
  color: string
  handleValueUpdate: HandleChange
  handleConfirmButton: HandleConfirmButton
  updateState: UpdateState
  addDataTabsHandler: OptionsHandler
  setInputRef?: (ref: any) => void 
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

function AddDataInput (props: Props) {

    const {
      setState,
      value,
      color,
      handleValueUpdate,
      handleConfirmButton,
      updateState,
      addDataTabsHandler,
      setInputRef
    } = props

    return (
      <Fragment>
        <StyledModalHeader>Add data to the map</StyledModalHeader>
        <StyledModalContents>
          <Tabs
            tabsHandler={addDataTabsHandler}
            updateState={updateState}
            id="addDataTabsHandler"
            width="150px"
            justify="flex-start"
          />
          {addDataTabsHandler.activeIdx === 0 && (
            <TextAreaInput
              id={'newRoute'}
              placeholder="Paste a valid routing-service response"
              editableValue={value}
              rows={15}
              handleValueUpdate={handleValueUpdate}
              handleInputChange={updateState}
              color={color}
              setInputRef={setInputRef}
            />
          )}
        </StyledModalContents>
        <Modal.Actions>
          <Box padding={'10px 20px'} direction="row" justify="flex-end">
            {color === 'red' && (
              <StyledLabel color="red">Invalid route response!</StyledLabel>
            )}
            <StyledButton
              backgroundcolor={COLOR}
              alignend
              onClick={() => handleConfirmButton(setState, value)}
            >
              Confirm
            </StyledButton>
          </Box>
        </Modal.Actions>
      </Fragment>
    )
}

export default ModalHOC(AddDataInput)
