import React from 'react'
import { Box, StyledSegment } from '../styledComponents'
import { Routes } from '../types'
import {
  ROUTING_SERVICE_COLOR,
  ROUTING_SERVICE_POLYLINE,
  ROUTING_SERVICE_STATS,
  THIRD_PARTY_COLOR,
  THIRD_PARTY_POLYLINE,
  THIRD_PARTY_STATS,
  TRAFFIC_COLOR,
  TRAFFIC_POLYLINE,
  TRAFFIC_STATS
} from '../utils/colours'
import RouteInfo from './RouteInfo'

interface Props {
  routes: Routes
}

const NAME_MAPPING: any = {
  googleRoute: {
    color: 'THIRD_PARTY',
    title: 'Google Maps',
    order: 3
  },
  route: {
    color: 'ROUTING_SERVICE',
    title: 'OSRM',
    subTitle: 'Route Stats',
    order: 1
  },
  trafficRoute: {
    color: 'TRAFFIC',
    subTitle: 'With traffic',
    title: 'Routing Service',
    order: 2
  }
}

const colours: any = {
  ROUTING_SERVICE_COLOR,
  ROUTING_SERVICE_POLYLINE,
  ROUTING_SERVICE_STATS,
  THIRD_PARTY_COLOR,
  THIRD_PARTY_POLYLINE,
  THIRD_PARTY_STATS,
  TRAFFIC_COLOR,
  TRAFFIC_POLYLINE,
  TRAFFIC_STATS
}

const RoutesInfoContainer = ({ routes }: Props) => {
  const filteredRoutes = Object.keys(routes).filter(
    routeId => routes[routeId].duration !== 0
  )

  if (filteredRoutes.length === 0) {
    return null
  }

  return (
    <Box
      padding="0"
      position="absolute"
      right="50px"
      top="30px"
      zindex={1000}
      width="200px"
      justify="flex-start"
    >
      {filteredRoutes
        .sort((a, b) => NAME_MAPPING[a].order - NAME_MAPPING[b].order)
        .map(routeId => {
          const colorMapping = NAME_MAPPING[routeId].color
          const title = NAME_MAPPING[routeId].title
          const subTitle = NAME_MAPPING[routeId].subTitle
          return (
            <RouteInfo
              key={routeId}
              statsColor={colours[`${colorMapping}_STATS`]}
              textColor={colours[`${colorMapping}_COLOR`]}
              iconColor={colours[`${colorMapping}_POLYLINE`]}
              title={title}
              subTitle={subTitle}
              route={routes[routeId]}
            />
          )
        })}
    </Box>
  )
}

export default RoutesInfoContainer
