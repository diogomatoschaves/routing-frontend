import React from 'react'
import styled from 'styled-components'
import { Box } from '../styledComponents'
import {
  GeographiesHandler,
  HandleConfirmButton,
  HandleDeleteRoute,
  HandleValueUpdate,
  InputColors,
  InputValues,
  LocationInfo,
  OptionsHandler,
  ProfileItem,
  Route,
  UpdatePoint,
  UpdateState
} from '../types'
import DebugPanel from './DebugPanel'
import DefaultPanel from './DefaultPanel'
import Tabs from './Tabs'

interface Props {
  updatePoint: UpdatePoint
  handleValueUpdate: HandleValueUpdate
  handleAddRoute: HandleConfirmButton
  handleClickRoute: HandleConfirmButton
  handleDeleteRoute: HandleDeleteRoute
  handleShowClick: () => void
  locations: LocationInfo[]
  profiles: ProfileItem[]
  routingGraphVisible: boolean
  polygonsVisible: boolean
  googleMapsOption: boolean
  trafficOption: boolean
  updateState: UpdateState
  geographies: GeographiesHandler
  profile: string
  duration: number
  urlMatchString: string
  debug: boolean
  modeTabsHandler: OptionsHandler
  addDataTabsHandler: OptionsHandler
  inputValues: InputValues
  inputColors: InputColors
  addedRoutes: Route[]
  loading: boolean
}

const PanelWrapper: any = styled(Box)`
  position: absolute;
  z-index: 1000;
  width: 30%;
  min-width: 350px;
  max-width: 450px;
  max-height: 80vh;
  left: 40px;
  top: 40px;
  padding: 25px 25px 35px 25px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 10px;
  box-shadow: 10px 10px 16px -9px rgba(77, 77, 77, 0.5);
  transition: flex 1s ease-out;
  overflow: auto;
`

const Panel: any = (props: Props) => {
  const {
    updatePoint,
    handleAddRoute,
    handleDeleteRoute,
    handleClickRoute,
    locations,
    profiles,
    routingGraphVisible,
    polygonsVisible,
    googleMapsOption,
    updateState,
    geographies,
    profile,
    urlMatchString,
    trafficOption,
    debug,
    modeTabsHandler,
    handleValueUpdate,
    inputValues,
    inputColors,
    addDataTabsHandler,
    addedRoutes,
    loading,
  } = props

  return (
    <PanelWrapper
      as={PanelWrapper}
      direction="column"
      justify="flex-start"
      animation={'scale'}
      duration={500}
      flex={debug}
    >
      <Box direction="row" justify="flex-start" padding="0 0 10px 0">
        <Tabs
          tabsHandler={modeTabsHandler}
          updateState={updateState}
          id="modeTabsHandler"
          width="100px"
          justify="flex-start"
        />
      </Box>
      {debug ? (
        <DebugPanel
          routingGraphVisible={routingGraphVisible}
          polygonsVisible={polygonsVisible}
          updateState={updateState}
          geographies={geographies}
          handleValueUpdate={handleValueUpdate}
          handleAddRoute={handleAddRoute}
          handleDeleteRoute={handleDeleteRoute}
          handleClickRoute={handleClickRoute}
          inputValues={inputValues}
          inputColors={inputColors}
          addDataTabsHandler={addDataTabsHandler}
          addedRoutes={addedRoutes}
        />
      ) : (
        <DefaultPanel
          updatePoint={updatePoint}
          locations={locations}
          routingGraphVisible={routingGraphVisible}
          polygonsVisible={polygonsVisible}
          googleMapsOption={googleMapsOption}
          updateState={updateState}
          geographies={geographies}
          profile={profile}
          urlMatchString={urlMatchString}
          trafficOption={trafficOption}
          profiles={profiles}
          loading={loading}
        />
      )}
    </PanelWrapper>
  )
}

export default Panel
