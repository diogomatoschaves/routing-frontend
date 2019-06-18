import React from 'react'
import { Box, StyledSegment } from '../styledComponents'
import styled from 'styled-components'
import { Statistic, Header } from 'semantic-ui-react'
import BackgroundIcon from './BackgroundIcon'
import { NORMAL_INPUT, PROFILE_BACKGROUND } from '../utils/colours'
import { computeDuration, computeDistance } from '../utils/functions'


interface Props {
  route: {
    duration: number,
    distance: number,
  },
  top: string,
  right: string,
  title: string,
  textColor: string
  iconColor: string
  statsColor: string
}

const StyledHeader = styled(Header)`
  &.ui.header {
    color: ${props => props.overridecolor ? props.overridecolor : 'black'};
    margin: 10px 0;
  }
`

const StyledStatistic = styled(Statistic)`
  &.ui.statistic > div{
    color: ${props => props.overridecolor ? props.overridecolor : 'black'};
  }
`

const diameter = 50

const RouteInfo: any = ({ right, top, route, title, textColor, iconColor, statsColor } : Props) => {

  const [durationValue, durationLabel] = computeDuration(route.duration)
  const [distanceValue, distanceLabel] = computeDistance(route.distance)

  return (
    <StyledSegment
      position="absolute"
      right={right}
      top={top}
      zindex={1000}
      width="200px"
    >
      <Box direction="column" justify="space-between">
        <StyledHeader overridecolor={textColor}>{title}</StyledHeader>
        <Box direction="row" justify="space-around" width="100%" padding="5px 0 5px 0">
          <Box direction="row" width="40%">
            <BackgroundIcon 
              diameter={diameter}
              color={PROFILE_BACKGROUND}
              iconColor={iconColor}
              circle={false}
              iconName={'time'}
              margin={"0 7px 0 0"}
            />
          </Box>
          <Box direction="row" width="60%">
            <StyledStatistic overridecolor={statsColor} size={"small"} style={{ margin: 0 }}>
              <Statistic.Value>
                {durationValue}
              </Statistic.Value>
              <Statistic.Label>
                {durationLabel}
              </Statistic.Label>
            </StyledStatistic>
          </Box>
        </Box>
        <Box direction="row" justify="space-around" width="100%" padding="5px 0 5px 0">
          <Box direction="row" width="40%">
            <BackgroundIcon 
              diameter={diameter}
              color={PROFILE_BACKGROUND}
              iconColor={iconColor}
              circle={false}
              iconName={'share alternate'}
              margin={"0 7px 0 0"}
            />
          </Box>
          <Box direction="row" width="60%">
          <StyledStatistic overridecolor={statsColor} size={'small'} style={{ margin: 0 }}>
              <Statistic.Value>
                {distanceValue}
              </Statistic.Value>
              <Statistic.Label>
                {distanceLabel}
              </Statistic.Label>
            </StyledStatistic>
          </Box>
        </Box>
      </Box>
    </StyledSegment>
  )
}

export default RouteInfo
