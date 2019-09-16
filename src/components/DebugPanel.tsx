import React, { useState } from 'react'
import { Box, EmptySpace, StyledButton } from '../styledComponents'
import OptionsSwitch from './OptionsSwitch'
import ProfileToggler from './ProfileToggler'
import AddDataInput from './AddDataInput'
import {
  UpdateState,
  Geography,
  HandleChange,
  HandleConfirmButton,
  OptionsHandler,
  HandleAddRoute,
  HandleDeleteRoute,
  Route,
  GeographiesHandler
} from '../types'
import { Icon } from 'semantic-ui-react'

interface Props {
  routingGraphVisible: boolean
  polygonsVisible: boolean
  updateState: UpdateState
  geographies: GeographiesHandler
  handleValueUpdate: HandleChange
  handleAddRoute: HandleConfirmButton
  handleDeleteRoute: HandleDeleteRoute
  handleClickRoute: HandleConfirmButton
  newRouteColor: string
  newRoute: string
  addDataTabsHandler: OptionsHandler
  addedRoutes: Array<Route>
}

export default function DebugPanel(props: Props) {
  const {
    routingGraphVisible,
    polygonsVisible,
    updateState,
    geographies,
    handleValueUpdate,
    handleAddRoute,
    handleDeleteRoute,
    handleClickRoute,
    newRouteColor,
    newRoute,
    addDataTabsHandler,
    addedRoutes
  } = props

  const [modalOpen, setState] = useState(false)

  const geography = geographies.options[geographies.activeIdx]

  return (
    <Box direction="column">
      <Box direction="row" padding="10px 0">
        <StyledButton alignself onClick={() => setState(true)} className={'add-route-button'}>
          <Icon name="plus" />
          Add Data
        </StyledButton>
      </Box>
      <Box direction="row" justify="space-between" padding="0 0 0 0">
        <Box direction="column" justify="flex-start" padding="0 0 0 0" width="60%">
          <OptionsSwitch
            checked={polygonsVisible}
            text={'Covered Areas'}
            id={'polygonsVisible'}
            updateState={updateState}
          />
          <OptionsSwitch
            checked={routingGraphVisible}
            text={'Routing Graph'}
            id={'routingGraphVisible'}
            updateState={updateState}
          />
        </Box>
        <Box direction="column" padding="0 0 0 0" width="35%">
          {routingGraphVisible || polygonsVisible ? (
            <ProfileToggler
              selectedOption={geography}
              optionsArray={geographies.options}
              updateState={updateState}
              id="geographies"
            />
          ) : (
            <EmptySpace width="40%" position="relative" />
          )}
        </Box>
      </Box>
      <AddDataInput
        id={'newRoute'}
        colorId={'newRouteColor'}
        open={modalOpen}
        setState={setState}
        updateState={updateState}
        handleValueUpdate={handleValueUpdate}
        handleAddRoute={handleAddRoute}
        handleDeleteRoute={handleDeleteRoute}
        handleClickRoute={handleClickRoute}
        color={newRouteColor}
        value={newRoute}
        addDataTabsHandler={addDataTabsHandler}
        addedRoutes={addedRoutes}
      />
    </Box>
  )
}
