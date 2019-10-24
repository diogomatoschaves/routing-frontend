import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { Box, StyledButton, StyledHeader, StyledText } from '../styledComponents'
import {
  HandleConfirmButton,
  HandleDeleteRoute,
  HandleValueUpdate,
  InputColors,
  InputValues,
  OptionsHandler,
  Route as RouteType,
  UpdateState
} from '../types'
import { MAIN_PETROL } from '../utils/colours'
import AddDataInput from './AddDataInput'
import Route from './Route'

interface Props {
  addedRoutes: RouteType[]
  handleValueUpdate: HandleValueUpdate
  handleAddRoute: HandleConfirmButton
  handleClickRoute: HandleConfirmButton
  handleDeleteRoute: HandleDeleteRoute
  inputValues: InputValues
  inputColors: InputColors
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
    inputValues,
    inputColors,
    addDataTabsHandler,
    updateState
  } = props

  const [modalOpen, setState] = useState(false)

  return (
    <Box width="80%" padding="10px 0 10px 0" direction="column" align="center">
      <Box direction="row" justify="space-between">
        <StyledHeader overridecolor={MAIN_PETROL}>Routes List</StyledHeader>
        <StyledButton alignself={true} onClick={() => setState(true)}>
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
            extraInfo={true}
            deleteRoute={handleDeleteRoute}
            buttonText={'Remove'}
            buttonColor={'red'}
          />
        ))
      ) : (
        <StyledText>No Routes to show.</StyledText>
      )}
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
