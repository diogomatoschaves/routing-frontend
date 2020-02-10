import React, { useCallback, useState } from 'react'
import { Box } from '../styledComponents'
import {
  GeographiesHandler,
  LocationInfo,
  ProfileItem,
  UpdatePoint,
  UpdateState
} from '../types'
import { ADD_WAYPOINT } from '../utils/colours'
import { addWaypoint, reorderWaypoints, sortWaypoints } from '../utils/functions'
import BackgroundIcon from './BackgroundIcon'
import InputRow from './InputRow'
import OptionsSwitch from './OptionsSwitch'
import ProfilesRow from './ProfilesRow'

interface Props {
  updatePoint: UpdatePoint
  locations: LocationInfo[]
  routingGraphVisible: boolean
  polygonsVisible: boolean
  googleMapsOption: boolean
  trafficOption: boolean
  updateState: UpdateState
  geographies: GeographiesHandler
  profile: string
  urlMatchString: string
  profiles: ProfileItem[]
  loading: boolean
}

const diameter = 50
const extraOptions = false

export default function DefaultPanel(props: Props) {
  const {
    updatePoint,
    locations,
    googleMapsOption,
    updateState,
    profile,
    urlMatchString,
    trafficOption,
    profiles,
    loading
  } = props

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      updateState(
        'locations',
        sortWaypoints(reorderWaypoints(locations, dragIndex, hoverIndex))
      )
    },
    [locations]
  )

  const [itemDragging, setItemDragging] = useState(null)

  return (
    <Box direction="column" justify="flex-start">
      <Box direction="row" justify="flex-start" padding="5px 0 10px 0">
        <ProfilesRow
          diameter={diameter}
          updateState={updateState}
          profile={profile}
          profiles={profiles}
        />
      </Box>
      {locations.map((item: LocationInfo, index: number) => {
        return (
          <InputRow
            key={index}
            rowKey={item.name}
            index={index}
            coords={{ lat: item.lat, lon: item.lon }}
            placeholder={item.placeholder}
            iconName={item.marker}
            updatePoint={updatePoint}
            updateState={updateState}
            moveRow={moveRow}
            urlMatchString={urlMatchString}
            loading={loading}
            defaultColor={item.markerColor}
            locations={locations}
            itemDragging={itemDragging}
            setItemDragging={setItemDragging}
          />
        )
      })}
      {locations.slice(-1)[0].lat && (
        <Box direction="row" justify="flex-start" padding="10px 0 0 0">
          <div onClick={() => updateState('locations', addWaypoint(locations))}>
            <BackgroundIcon
              diameter={38}
              color={ADD_WAYPOINT}
              iconColor={'white'}
              circle={true}
              iconName={'plus'}
              margin={'0 10px 0 0'}
              loading={false}
              cursor="pointer"
            />
          </div>
          Add Destination
        </Box>
      )}
      {extraOptions && (
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
      )}
    </Box>
  )
}
