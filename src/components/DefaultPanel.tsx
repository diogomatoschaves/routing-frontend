import React from 'react'
import { Box } from '../styledComponents'
import InputRow from './InputRow'
import OptionsSwitch from './OptionsSwitch'
import ProfilesRow from './ProfilesRow'
import { UpdatePoint, UpdateState, Location, Geography } from '../types'


interface Props {
  updatePoint: UpdatePoint
  locations: Array<Location>
  routingGraphVisible: boolean
  polygonsVisible: boolean
  googleMapsOption: boolean
  trafficOption: boolean
  updateState: UpdateState
  geography: Geography
  geographies: Array<Geography>
  profile: string
  urlMatchString: string
}

const diameter = 50

export default function DefaultPanel(props: Props) {

  const {
    updatePoint,
    locations,
    googleMapsOption,
    updateState,
    profile,
    urlMatchString,
    trafficOption,
  } = props

  return (
    <Box direction="column" justify="flex-start">
      <Box direction="row" justify="flex-start" padding="5px 0 10px 0">
        <ProfilesRow diameter={diameter} updateState={updateState} profile={profile} />
      </Box>
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
      <Box direction="row" justify="space-around" padding="10px 0">
        <OptionsSwitch
          checked={googleMapsOption}
          text={'Google Maps'}
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
    </Box>
  )
}