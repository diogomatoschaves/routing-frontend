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
  HandleChange,
  Route,
  HandleConfirmButton,
  HandleDeleteRoute,
  Option,
  GoogleResponse
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
  handleValueUpdate: HandleChange
  locations: Array<Location>
  selectedService: number
  serviceOptions: any
  bodyValue: string
  bodyColor: string
  bodyEdit: boolean
  responseValue: string
  responseEdit: boolean
  debug: boolean
  addedRoutes: Array<Route>
	handleAddRoute: HandleConfirmButton
	handleClickRoute: HandleConfirmButton
	handleDeleteRoute: HandleDeleteRoute
	handleChangeBody: HandleConfirmButton
	handleCloseModal: HandleConfirmButton
	newRouteColor: string
	newRoute: string
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
    bodyValue,
    responseValue,
    bodyColor,
    responseEdit,
    bodyEdit,
    debug,
    addedRoutes,
    handleAddRoute,
    handleClickRoute,
    handleDeleteRoute,
    handleChangeBody,
    handleCloseModal,
		newRouteColor, 
		newRoute, 
    addDataTabsHandler,
    modeTabsHandler,
    responseOptionsHandler
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
          newRoute={newRoute}
          newRouteColor={newRouteColor}
          addDataTabsHandler={addDataTabsHandler}
          handleAddRoute={handleAddRoute}
          handleClickRoute={handleClickRoute}
          handleDeleteRoute={handleDeleteRoute}
          handleValueUpdate={handleValueUpdate}
          updateState={updateState}
        />
      ) : (
        <Fragment>
          <Box padding="10px 10px 0 0" height={'70px'} direction="row" justify="space-around">
            <Box width="35%" padding="0 0 0 3%">
              <StyledDropdown
                placeholder="Select Service"
                id={'selectedService'}
                fluid
                selection
                options={serviceOptions}
                value={selectedService}
                onChange={(e: any, { id, value }: any) => updateState(id, value)}
              />
            </Box>
            <Box width="35%">
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
              id={'bodyValue'}
              colorId={'bodyColor'}
              buttonId={'bodyEdit'}
              buttonText={'Confirm'}
              value={body}
              editableValue={bodyValue}
              updateState={updateState}
              handleValueUpdate={handleValueUpdate}
              handleConfirmButton={handleChangeBody}
              className="body-textarea"
              text={'Request Body'}
              edit={bodyEdit}
              editable={true}
              color={bodyColor}
              title={'Edit Request Body'}
            />
          </Box>
          <Box width="80%" padding="10px 0 10px 0">
            <JsonBlock
              id={'responseValue'}
              colorId={'responseColor'}
              buttonId={'responseEdit'}
              buttonText={'Close'}
              value={response}
              editableValue={responseValue}
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
