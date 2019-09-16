import React, { Fragment } from 'react'
import ProfileToggler from './ProfileToggler'
import JsonBlock from './JsonBlock'
import RoutesList from './RoutesList'
import { Box, StyledDropdown, StyledHeader, StyledDivider } from '../styledComponents'
import {
  RouteResponse,
  Body,
  UpdateState,
  UpdatePoint,
  Location,
  MatchResponse,
  OptionsHandler,
  HandleValueUpdate,
  Route,
  HandleConfirmButton,
  HandleDeleteRoute,
  Option,
  GoogleResponse,
  InputValues,
  InputColors
} from '../types'
import { MAIN_PETROL } from '../utils/colours'
import EndpointRow from './EndpointRow'
import Tabs from './Tabs';

interface Props {
  handleHideClick: (e: any) => void
  response: RouteResponse | GoogleResponse | MatchResponse
  responseOptionsHandler: OptionsHandler
  responseOption: Option
  body: Body
  endpointHandler: OptionsHandler
  updateState: UpdateState
  updatePoint: UpdatePoint
  handleValueUpdate: HandleValueUpdate
  locations: Array<Location>
  selectedService: number
  serviceOptions: any
  bodyEdit: boolean
  responseEdit: boolean
  debug: boolean
  inputValues: InputValues
  inputColors: InputColors
  addedRoutes: Array<Route>
	handleAddRoute: HandleConfirmButton
	handleClickRoute: HandleConfirmButton
	handleDeleteRoute: HandleDeleteRoute
	handleChangeBody: HandleConfirmButton
	handleCloseModal: HandleConfirmButton
	addDataTabsHandler: OptionsHandler
	modeTabsHandler: OptionsHandler
}

export default function InspectPanel(props: Props) {
  const {
    endpointHandler,
    updateState,
    handleValueUpdate,
    responseOption,
    response,
    body,
    selectedService,
    serviceOptions,
    responseEdit,
    bodyEdit,
    debug,
    addedRoutes,
    handleAddRoute,
    handleClickRoute,
    handleDeleteRoute,
    handleChangeBody,
    handleCloseModal,
    addDataTabsHandler,
    modeTabsHandler,
    responseOptionsHandler,
    inputValues,
    inputColors
  } = props

  return (
    <Box>
      <Box direction="row" justify="center" padding="0 0 10px 0">
        <Tabs
          tabsHandler={modeTabsHandler}
          updateState={updateState}
          id="modeTabsHandler"
          width="100px"
          justify="center"
        />
      </Box>
      <StyledDivider width="90%"/>
      {debug ? (
        <RoutesList 
          addedRoutes={addedRoutes}
          inputValues={inputValues}
          inputColors={inputColors}
          addDataTabsHandler={addDataTabsHandler}
          handleAddRoute={handleAddRoute}
          handleClickRoute={handleClickRoute}
          handleDeleteRoute={handleDeleteRoute}
          handleValueUpdate={handleValueUpdate}
          updateState={updateState}
        />
      ) : (
        <Fragment>
          <Box padding="10px 10px 0 40px" height={'70px'} direction="row" justify="flex-start">
            <Box width="40%">
              {serviceOptions[selectedService].key === 'Route' && (
                <ProfileToggler
                  optionsArray={responseOptionsHandler.options}
                  selectedOption={responseOption}
                  updateState={updateState}
                  id={'responseOptionsHandler'}
                />
              )}
            </Box>
          </Box>
          <Box width="80%" padding="10px 0 10px 0">
            <StyledHeader overridecolor={MAIN_PETROL}>Request Endpoint</StyledHeader>
            <Box direction="row" justify="flex-start" padding="5px 0 10px 0">
              <EndpointRow updateState={updateState} endpointHandler={endpointHandler} />
            </Box>
          </Box>
          <Box width="80%" padding="10px 0 10px 0">
            <JsonBlock
              id={'body'}
              buttonId={'bodyEdit'}
              buttonText={'Confirm'}
              value={body}
              inputValues={inputValues}
              inputColors={inputColors}
              updateState={updateState}
              handleValueUpdate={handleValueUpdate}
              handleConfirmButton={handleChangeBody}
              className="body-textarea"
              text={'Request Body'}
              edit={bodyEdit}
              editable={true}
              title={'Edit Request Body'}
            />
          </Box>
          <Box width="80%" padding="10px 0 10px 0">
            <JsonBlock
              id={'response'}
              buttonId={'responseEdit'}
              buttonText={'Close'}
              value={response}
              inputValues={inputValues}
              inputColors={inputColors}
              updateState={updateState}
              handleConfirmButton={handleCloseModal}
              className="response-textarea"
              text={'Response'}
              edit={responseEdit}
              editable={false}
              title={'View Response'}
            />
          </Box>
        </Fragment>
      )} 
    </Box>
  )
}
