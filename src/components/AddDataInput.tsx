import React, { Fragment } from 'react'
import { Label, Modal } from 'semantic-ui-react'
import styled from 'styled-components'
import { Box, StyledButton } from '../styledComponents'
import {
  HandleConfirmButton,
  HandleDeleteRoute,
  HandleValueUpdate,
  InputColors,
  InputValues,
  OptionsHandler,
  Route,
  UpdateState
} from '../types'
import { MAIN_PETROL as COLOR } from '../utils/colours'
import ModalHOC from './ModalHOC'
import RoutesFromDB from './RoutesFromDB'
import Tabs from './Tabs'
import TextAreaInput from './TextAreaInput'

interface Props {
  open: boolean
  setState: any
  inputValues: InputValues
  inputColors: InputColors
  handleValueUpdate: HandleValueUpdate
  handleAddRoute: HandleConfirmButton
  handleDeleteRoute: HandleDeleteRoute
  handleClickRoute: HandleConfirmButton
  updateState: UpdateState
  addDataTabsHandler: OptionsHandler
  setInputRef?: (ref: any) => void
  addedRoutes: Route[]
}

const StyledLabel = styled(Label)`
  &.ui.label {
    margin-right: 20px;
  }
`

const StyledModalHeader = styled(Modal.Header)`
  &.ui.modal > .header {
    font-family: 'BasisGrotesque Medium', Lato !important;
  }
`

const StyledModalContents = styled(Modal.Content)`
  min-height: 50vh;
  max-height: 50vh !important;
`

function AddDataInput(props: Props) {
  const {
    setState,
    inputValues,
    inputColors,
    handleValueUpdate,
    handleAddRoute,
    handleDeleteRoute,
    handleClickRoute,
    updateState,
    addDataTabsHandler,
    setInputRef,
    addedRoutes
  } = props

  const key = addDataTabsHandler.options[addDataTabsHandler.activeIdx].key
  const loadFromDB = key === 'db'

  return (
    <Fragment>
      <StyledModalHeader>Add data to the map</StyledModalHeader>
      <StyledModalContents scrolling={true}>
        <Tabs
          tabsHandler={addDataTabsHandler}
          updateState={updateState}
          id="addDataTabsHandler"
          width="150px"
          justify="flex-start"
        />
        {!loadFromDB ? (
          <TextAreaInput
            id={key}
            placeholder={`Paste a valid ${key} response`}
            editableValue={inputValues[key]}
            rows={15}
            handleValueUpdate={handleValueUpdate}
            handleInputChange={updateState}
            color={inputColors[key]}
            setInputRef={setInputRef}
            inputValues={inputValues}
          />
        ) : (
          <RoutesFromDB
            handleClickRoute={handleClickRoute}
            handleDeleteRoute={handleDeleteRoute}
            setState={setState}
            addedRoutes={addedRoutes}
          />
        )}
      </StyledModalContents>
      <Modal.Actions>
        <Box padding={'10px 20px'} direction="row" justify="flex-end">
          {inputColors[key] === 'red' && (
            <StyledLabel color="red">Invalid route response!</StyledLabel>
          )}
          <StyledButton
            backgroundcolor={COLOR}
            alignend={true}
            onClick={() =>
              !loadFromDB
                ? handleAddRoute(setState, inputValues[key], key)
                : setState(false)
            }
          >
            {!loadFromDB ? 'Confirm' : 'Close'}
          </StyledButton>
        </Box>
      </Modal.Actions>
    </Fragment>
  )
}

export default (process.env.NODE_ENV === 'test' ? AddDataInput : ModalHOC(AddDataInput))
