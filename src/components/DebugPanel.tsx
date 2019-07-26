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
  OptionsHandler
} from '../types'
import { Icon } from 'semantic-ui-react'

interface Props {
  routingGraphVisible: boolean
  polygonsVisible: boolean
  updateState: UpdateState
  geography: Geography
  geographies: Array<Geography>
  handleValueUpdate: HandleChange
  handleConfirmButton: HandleConfirmButton
  newRouteColor: string
  newRoute: string
  addDataTabsHandler: OptionsHandler
}

export default function DebugPanel(props: Props) {
  const {
    routingGraphVisible,
    polygonsVisible,
    updateState,
    geography,
    geographies,
    handleValueUpdate,
    handleConfirmButton,
    newRouteColor,
    newRoute,
    addDataTabsHandler
  } = props

  const [modalOpen, setState] = useState(false)

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
              geography={geography}
              geographies={geographies}
              updateState={updateState}
              id="geography"
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
        handleConfirmButton={handleConfirmButton}
        color={newRouteColor}
        value={newRoute}
        addDataTabsHandler={addDataTabsHandler}
      />
    </Box>
  )
}
