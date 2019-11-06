import React from 'react'
import { Header, Statistic } from 'semantic-ui-react'
import styled from 'styled-components'
import { Box, StyledSegment } from '../styledComponents'
import { Route } from '../types'
import { PROFILE_BACKGROUND } from '../utils/colours'
import { computeDistance, computeDuration } from '../utils/functions'
import BackgroundIcon from './BackgroundIcon'

interface Props {
  route: Route
  top?: string
  right?: string
  title: string
  subTitle?: string
  textColor: string
  iconColor: string
  statsColor: string
}

const StyledHeader = styled(Header)`
  &.ui.header {
    color: ${props => (props.overridecolor ? props.overridecolor : 'black')};
    margin: ${props =>
      props.nomargin ? 0 : props.nomarginbottom ? '10px 0 0 0' : '10px 0'};
    font-family: 'BasisGrotesque Medium', Lato, 'Helvetica Neue', Arial, Helvetica,
      sans-serif;
  }
`

const StyledStatistic = styled(Statistic)`
  &.ui.statistic > div {
    font-family: 'BasisGrotesque Medium', Lato, 'Helvetica Neue', Arial, Helvetica,
      sans-serif;
    color: ${props => (props.overridecolor ? props.overridecolor : 'black')};
  }
`

const diameter = 50

export default function RouteInfo({
  route,
  title,
  textColor,
  iconColor,
  statsColor,
  subTitle
}: Props) {
  const [durationValue, durationLabel] = computeDuration(route.duration)
  const [distanceValue, distanceLabel] = computeDistance(route.distance)

  return (
    <StyledSegment width="100%" padding="15px 25px" noBoxShadow={false}>
      <Box direction="column" justify="space-between">
        <StyledHeader nomarginbottom={1} overridecolor={textColor}>
          {title}
        </StyledHeader>
        {subTitle && (
          <StyledHeader size="small" overridecolor={iconColor}>
            {subTitle}
          </StyledHeader>
        )}
        <Box direction="row" justify="space-around" width="100%" padding="5px 0 5px 0">
          <Box direction="row" width="40%" justify="center">
            <BackgroundIcon
              diameter={diameter}
              color={PROFILE_BACKGROUND}
              iconColor={iconColor}
              circle={false}
              iconName={'time'}
              margin={'0 7px 0 0'}
            />
          </Box>
          <Box direction="row" width="60%" justify="center">
            <StyledStatistic
              overridecolor={statsColor}
              size={'tiny'}
              style={{ margin: 0 }}
            >
              <Statistic.Value>{durationValue}</Statistic.Value>
              <Statistic.Label>{durationLabel}</Statistic.Label>
            </StyledStatistic>
          </Box>
        </Box>
        <Box direction="row" justify="space-around" width="100%" padding="5px 0 5px 0">
          <Box direction="row" width="40%" justify="center">
            <BackgroundIcon
              diameter={diameter}
              color={PROFILE_BACKGROUND}
              iconColor={iconColor}
              circle={false}
              iconName={'road'}
              margin={'0 7px 0 0'}
            />
          </Box>
          <Box direction="row" width="60%" justify="center">
            <StyledStatistic
              overridecolor={statsColor}
              size={'tiny'}
              style={{ margin: 0 }}
            >
              <Statistic.Value>{distanceValue}</Statistic.Value>
              <Statistic.Label>{distanceLabel}</Statistic.Label>
            </StyledStatistic>
          </Box>
        </Box>
      </Box>
    </StyledSegment>
  )
}
