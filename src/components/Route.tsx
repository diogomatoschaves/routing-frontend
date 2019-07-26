import React, { useState } from 'react';
import styled from 'styled-components'
import { Route as RouteType, UpdateState } from '../types';
import { Segment, Statistic } from 'semantic-ui-react'
import { Box } from '../styledComponents'
import RecursiveJSONProperty from './RecursiveJSONProperty';
import { computeDuration, computeDistance } from '../utils/functions';

interface Props {
	route: RouteType,
	updateState: UpdateState
}

const StyledSegment = styled(Segment)`
	&.ui.segment {
		width: 100%;
		border: none;
		border-radius: 10px;
		min-height: 100px;
		background-color: rgb(250, 250, 250);
		cursor: pointer;
		transition: transform 0.25s ease;
	}
 `
 
 const InfoTitle = styled.div`
   font-size: 1.1em;
   font-weight: 700;
   color: rgb(150, 150, 150);
	 padding: 10px 0;
 `
 
 const InfoDescription = styled.div`
   font-size: 1.1em;
   font-weight: 700;
   color: ${props => (props.color ? props.color : 'rgb(50, 50, 50)')};
   padding-left: 10px;
 `

const StyledStatistic = styled(Statistic)`
	&.ui.statistic > div {
		color: ${props => (props.overridecolor ? props.overridecolor : 'black')};
		margin-left: 15px;
}
`
 
export default function Route(props: Props) {

	const { route, updateState } = props

	const [expanded, setState] = useState(false)

	const [durationValue, durationLabel] = computeDuration(route.duration)
  const [distanceValue, distanceLabel] = computeDistance(route.distance)

	return (
		<StyledSegment 
			padded 
			onClick={(e: any) => {
				e.stopPropagation()
				setState(!expanded)
			}}
			onMouseEnter={() => updateState('routeHighlight', route.id)}
			onMouseLeave={() => updateState('routeHighlight', '')}
		>
			<Box direction="row">
				<InfoTitle>Duration:</InfoTitle>
				<StyledStatistic
					overridecolor={'rgb(50, 50, 50)'}
					size={'mini'}
					style={{ margin: 0 }}
					horizontal
				>
					<Statistic.Value>{durationValue}</Statistic.Value>
					<Statistic.Label>{durationLabel}</Statistic.Label>
				</StyledStatistic>
			</Box>
			<Box direction="row">
				<InfoTitle>Distance:</InfoTitle>
				<StyledStatistic
					overridecolor={'rgb(50, 50, 50)'}
					size={'mini'}
					style={{ margin: 0 }}
					horizontal
				>
					<Statistic.Value>{distanceValue}</Statistic.Value>
					<Statistic.Label>{distanceLabel}</Statistic.Label>
				</StyledStatistic>
			</Box>
			<RecursiveJSONProperty
				property={route.parsedValue}
				propertyName=""
				excludeBottomBorder={true}
				rootProperty={true}
			/>
		</StyledSegment>
	)
}
