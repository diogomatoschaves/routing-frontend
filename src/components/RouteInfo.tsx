import React from 'react'
import { Box, StyledSegment } from '../styledComponents'
import { Statistic } from 'semantic-ui-react'
import BackgroundIcon from './BackgroundIcon'
import { NORMAL_INPUT, PROFILE_BACKGROUND } from '../utils/colours'
import { computeDuration, computeDistance } from '../utils/functions'


interface Props {
  duration: number,
  distance: number
}

const diameter = 50

const RouteInfo: any = ({ duration, distance } : Props) => {

  const [durationValue, durationLabel] = computeDuration(duration)
  const [distanceValue, distanceLabel] = computeDistance(distance)

  return (
    <StyledSegment
      position="absolute"
      right="50px"
      bottom="50px"
      zindex={1000}
      width="200px"
    >
      <Box direction="column" justify="space-between">
        <Box direction="row" justify="space-around" width="60%" padding="5px 0 5px 0">
          <BackgroundIcon 
            diameter={diameter}
            color={PROFILE_BACKGROUND}
            iconColor={NORMAL_INPUT}
            circle={false}
            iconName={'time'}
            margin={"0 7px 0 0"}
          />
          <Statistic size={"small"} style={{ margin: 0 }}>
            <Statistic.Value>
              {durationValue}
            </Statistic.Value>
            <Statistic.Label>
              {durationLabel}
            </Statistic.Label>
          </Statistic>
        </Box>
        <Box direction="row" justify="space-around" width="60%" padding="5px 0 5px 0">
          <BackgroundIcon 
            diameter={diameter}
            color={PROFILE_BACKGROUND}
            iconColor={NORMAL_INPUT}
            circle={false}
            iconName={'share alternate'}
            margin={"0 7px 0 0"}
          />
          <Statistic size={'small'} style={{ margin: 0 }}>
            <Statistic.Value>
              {distanceValue}
            </Statistic.Value>
            <Statistic.Label>
              {distanceLabel}
            </Statistic.Label>
          </Statistic>
        </Box>
      </Box>
    </StyledSegment>
  )
}

export default RouteInfo
