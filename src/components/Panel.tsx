import React from 'react'
import styled from 'styled-components'
import { Divider, Checkbox, Button, Form, TextArea } from 'semantic-ui-react'
import { Box, EmptySpace } from '../styledComponents'
import InputRow from './InputRow'
import OptionsSwitch from './OptionsSwitch'
import ProfilesRow from './ProfilesRow'
import ProfileToggler from './ProfileToggler'
import { UpdatePoint, UpdateState, Location, Geography } from '../types'

interface Props {
  updatePoint: UpdatePoint
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
}

const PanelWrapper: any = styled.div`
  position: absolute;
  z-index: 1000;
  width: 32%;
  min-width: 400px;
  max-width: 500px;
  max-height: 1000px;
  /* height: 250px; */
  left: 40px;
  top: 40px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.92);
  /* border: 1px solid rgb(205, 205, 205); */
  border-radius: 10px;
  box-shadow: 10px 10px 16px -9px rgba(77, 77, 77, 0.5);
`

const StyledDivider = styled(Divider)`
  &.ui.divider {
    margin-top: 0.6rem;
    border-top: 1px solid rgb(200, 200, 200);
  }

  width: calc(100%);
`

const diameter = 50

const Panel: any = (props: Props) => {
  const {
    updatePoint,
    locations,
    routingGraphVisible,
    polygonsVisible,
    googleMapsOption,
    updateState,
    geography,
    geographies,
    profile,
    handleShowClick,
    urlMatchString,
    trafficOption
  } = props

  return (
    <PanelWrapper>
      <Box direction="column" justify="flex-start">
        <Box direction="row" justify="flex-start" padding="5px 0 10px 0">
          <ProfilesRow diameter={diameter} updateState={updateState} profile={profile} />
        </Box>
        <StyledDivider />
        {locations.map((item: Location, index: number) => {
          return (
            <InputRow
              key={index}
              rowKey={item.name}
              index={index}
              coords={{ lat: item.lat, lng: item.lng }}
              placeholder={item.placeholder}
              iconName={item.marker}
              updatePoint={updatePoint}
              urlMatchString={urlMatchString}
            />
          )
        })}
        <StyledDivider />
        <Box direction="row" justify="space-between" padding="0 0 0 0">
          <Box direction="column" justify="flex-start" padding="0 0 0 0" width="50%">
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
          <Box direction="column" padding="0 0 0 0" width="40%">
            {routingGraphVisible || polygonsVisible ? (
              <ProfileToggler
                geography={geography}
                geographies={geographies}
                updateState={updateState}
                id='geography'
              />
            ) : (
              <EmptySpace width="40%" position="relative" />
            )}
          </Box>
        </Box>
        <Box direction="row" justify="space-around">
          <OptionsSwitch
            checked={googleMapsOption}
            text={'Compare Google Maps'}
            id={'googleMapsOption'}
            updateState={updateState}
            width={'65%'}
          />
          <OptionsSwitch
            checked={trafficOption}
            text={'Traffic'}
            id={'trafficOption'}
            updateState={updateState}
            width={'35%'}
          />
        </Box>
        <Box direction="row" justify="flex-start" padding="10px 0 10px 0">
          <Button onClick={handleShowClick}>See response</Button>
        </Box>
      </Box>
    </PanelWrapper>
  )
}

export default Panel
