import React, { useState } from 'react';
import styled from 'styled-components'
import { 
	Route as RouteType, 
	HandleChange, 
	HandleConfirmButton, 
	OptionsHandler, 
	UpdateState 
} from '../types';
import { Box, StyledHeader, StyledButton } from '../styledComponents'
import { MAIN_PETROL } from '../utils/colours';
import Route from './Route'
import AddDataInput from './AddDataInput';
import { Icon } from 'semantic-ui-react';

interface Props {
	addedRoutes: Array<RouteType>
	handleValueUpdate: HandleChange
	handleConfirmButton: HandleConfirmButton
	newRouteColor: string
	newRoute: string
	addDataTabsHandler: OptionsHandler
	updateState: UpdateState
}

const NoRoutesText = styled.div`
   font-size: 1em;
   font-weight: 700;
   color: rgb(150, 150, 150);
	 padding: 10px 0;
	 align-self: flex-start;
 `

export default function RoutesList(props: Props) {

	const { 
		addedRoutes, 
		handleValueUpdate, 
		handleConfirmButton, 
		newRouteColor, 
		newRoute, 
		addDataTabsHandler,
		updateState,
	} = props

	const [modalOpen, setState] = useState(false)

	return (
		<Box width="80%" padding="10px 0 10px 0" direction="column" align="center">
			<Box direction="row" justify="space-between">
				<StyledHeader overridecolor={MAIN_PETROL}>Routes List</StyledHeader>
				<StyledButton alignself onClick={() => setState(true)}>
					<Icon name="plus" />
					Add Data
        </StyledButton>
			</Box>
			{addedRoutes.length > 0 ? (
				addedRoutes.map(route => <Route key={route.id} route={route} updateState={updateState}/>)
			) : (
				<NoRoutesText>No Routes to show.</NoRoutesText>
			)}
			<AddDataInput
        id={'newRoute'}
        colorId={'newRouteColor'}
        open={modalOpen}
        setState={setState}
        updateState={updateState}
        handleValueUpdate={handleValueUpdate}
        handleConfirmButton={handleConfirmButton}
        color={newRouteColor}
        value={newRoute}
        addDataTabsHandler={addDataTabsHandler}
      />
		</Box>
	)

}
