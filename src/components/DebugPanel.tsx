import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { Box, EmptySpace, StyledButton } from '../styledComponents'
import {
  GeographiesHandler,
  HandleConfirmButton,
  HandleDeleteRoute,
  HandleValueUpdate,
  InputColors,
  InputValues,
  OptionsHandler,
  Route,
  UpdateState
} from '../types'
import AddDataInput from './AddDataInput'
import OptionsSwitch from './OptionsSwitch'
import ProfileToggler from './ProfileToggler'

interface Props {
  routingGraphVisible: boolean
  polygonsVisible: boolean
  updateState: UpdateState
  geographies: GeographiesHandler
  handleValueUpdate: HandleValueUpdate
  handleAddRoute: HandleConfirmButton
  handleDeleteRoute: HandleDeleteRoute
  handleClickRoute: HandleConfirmButton
  inputValues: InputValues
  inputColors: InputColors
  addDataTabsHandler: OptionsHandler
  addedRoutes: Route[]
}

export default function DebugPanel(props: Props) {
  const {
    routingGraphVisible,
    updateState,
    handleValueUpdate,
    handleAddRoute,
    handleDeleteRoute,
    handleClickRoute,
    inputValues,
    inputColors,
    addDataTabsHandler,
    addedRoutes
  } = props

  const [modalOpen, setState] = useState(false)
  return (
    <Box direction="column">
      <Box direction="row" padding="10px 0">
        <StyledButton
          alignself={true}
          onClick={() => setState(true)}
          className={'add-route-button'}
        >
          <Icon name="plus" />
          Add Data
        </StyledButton>
      </Box>
      <Box direction="row" justify="space-between" padding="0 0 0 0">
        <Box direction="column" justify="flex-start" padding="0 0 0 0" width="60%">
          <OptionsSwitch
            checked={routingGraphVisible}
            text={'Routing Graph'}
            id={'routingGraphVisible'}
            updateState={updateState}
          />
        </Box>
      </Box>
      <AddDataInput
        open={modalOpen}
        setState={setState}
        updateState={updateState}
        handleValueUpdate={handleValueUpdate}
        handleAddRoute={handleAddRoute}
        handleDeleteRoute={handleDeleteRoute}
        handleClickRoute={handleClickRoute}
        inputValues={inputValues}
        inputColors={inputColors}
        addDataTabsHandler={addDataTabsHandler}
        addedRoutes={addedRoutes}
      />
    </Box>
  )
}
