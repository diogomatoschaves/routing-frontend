import React from 'react'
import styled from 'styled-components'
import { Transition } from 'semantic-ui-react'
import { Box } from '../styledComponents'
import DefaultPanel from './DefaultPanel'
import DebugPanel from './DebugPanel'
import Tabs from './Tabs'
import {
  UpdatePoint,
  UpdateState,
  Location,
  Geography,
  OptionsHandler,
  HandleChange,
  HandleConfirmButton
} from '../types'

interface Props {
  updatePoint: UpdatePoint
  handleValueUpdate: HandleChange
  handleConfirmButton: HandleConfirmButton
  handleShowClick: () => void
  locations: Array<Location>
  routingGraphVisible: boolean
  polygonsVisible: boolean
  googleMapsOption: boolean
  trafficOption: boolean
  updateState: UpdateState
  geography: Geography
  geographies: Array<Geography>
  profile: string
  duration: number
  urlMatchString: string
  debug: boolean
  modeTabsHandler: OptionsHandler
  addDataTabsHandler: OptionsHandler
  newRouteColor: string
  newRoute: string
}

const PanelWrapper: any = styled(Box)`
  position: absolute;
  z-index: 1000;
  width: 24%;
  min-width: 350px;
  max-width: 450px;
  max-height: 1000px;
  left: 40px;
  top: 40px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 10px;
  box-shadow: 10px 10px 16px -9px rgba(77, 77, 77, 0.5);
  transition: flex 1s ease-out;
`

const Panel: any = (props: Props) => {
  const {
    updatePoint,
    handleConfirmButton,
    locations,
    routingGraphVisible,
    polygonsVisible,
    googleMapsOption,
    updateState,
    geography,
    geographies,
    profile,
    urlMatchString,
    trafficOption,
    debug,
    modeTabsHandler,
    handleValueUpdate,
    newRouteColor,
    newRoute,
    addDataTabsHandler
  } = props

  return (
    <Transition.Group
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
          geography={geography}
          geographies={geographies}
          handleValueUpdate={handleValueUpdate}
          handleConfirmButton={handleConfirmButton}
          newRouteColor={newRouteColor}
          newRoute={newRoute}
          addDataTabsHandler={addDataTabsHandler}
        />
      ) : (
        <DefaultPanel
          updatePoint={updatePoint}
          locations={locations}
          routingGraphVisible={routingGraphVisible}
          polygonsVisible={polygonsVisible}
          googleMapsOption={googleMapsOption}
          updateState={updateState}
          geography={geography}
          geographies={geographies}
          profile={profile}
          urlMatchString={urlMatchString}
          trafficOption={trafficOption}
        />
      )}
    </Transition.Group>
  )
}

export default Panel
