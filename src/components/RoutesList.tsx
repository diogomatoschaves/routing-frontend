import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Route as RouteType,
  HandleChange,
  HandleConfirmButton,
  OptionsHandler,
  UpdateState,
  HandleDeleteRoute
} from '../types'
import { Box, StyledHeader, StyledButton, StyledText } from '../styledComponents'
import { MAIN_PETROL } from '../utils/colours'
import Route from './Route'
import AddDataInput from './AddDataInput'
import { Icon } from 'semantic-ui-react'

interface Props {
  addedRoutes: Array<RouteType>
  handleValueUpdate: HandleChange
  handleAddRoute: HandleConfirmButton
  handleClickRoute: HandleConfirmButton
  handleDeleteRoute: HandleDeleteRoute
  newRouteColor: string
  newRoute: string
  addDataTabsHandler: OptionsHandler
  updateState: UpdateState
}

export default function RoutesList(props: Props) {
  const {
    addedRoutes,
    handleValueUpdate,
    handleAddRoute,
    handleClickRoute,
    handleDeleteRoute,
    newRouteColor,
    newRoute,
    addDataTabsHandler,
    updateState,
  } = props

  const [modalOpen, setState] = useState(false)

  return (
    <Box width="80%" padding="10px 0 10px 0" direction="column" align="center">
      <Box direction="row" justify="space-between">
        <StyledHeader overridecolor={MAIN_PETROL}>Routes List</StyledHeader>
        <StyledButton alignself onClick={() => setState(true)}>
          <Icon name="plus" />
          Add Data
        </StyledButton>
      </Box>
      {addedRoutes.length > 0 ? (
        addedRoutes.map(route => (
          <Route 
            key={route.id} 
            route={route} 
            updateState={updateState} 
            json={true}
            deleteRoute={handleDeleteRoute}
            buttonText={'Remove'}
            buttonColor={'red'}
          />
        ))
      ) : (
        <StyledText>No Routes to show.</StyledText>
      )}
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
