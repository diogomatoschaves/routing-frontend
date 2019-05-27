import React from 'react'
import styled from 'styled-components'
import { Popup, Divider } from 'semantic-ui-react'
import { Box, StyledIcon, ColoredDiv, EmptySpace } from '../styledComponents'
import InputRow from './InputRow'
import BackgroundIcon from './BackgroundIcon'
import { PETROL_4, PETROL_1, PROFILE_BACKGROUND } from '../utils/colours'
import { UpdatePoint, Location } from '../types'

interface Props {
  updatePoint: UpdatePoint,
  locations: Array<Location>
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
  box-shadow: 10px 10px 16px -9px rgba(77,77,77,0.5);
`

const StyledDivider = styled(Divider)`

  &.ui.divider {
    margin-top: 0.6rem;
    border-top: 1px solid rgb(0, 0, 0)
  }

  width: calc(100%);
`

const diameter = 50

const Panel: any = ({ updatePoint, locations } : Props) => {
  return (
    <PanelWrapper >
      <Box direction="column" justify="flex-start">
        <Box direction="row" justify="flex-start" padding="5px 0 10px 0">
          <Popup
            trigger={
              <BackgroundIcon 
                diameter={diameter}
                color={PROFILE_BACKGROUND}
                iconColor={PETROL_4}
                circle={false}
                iconName={'car'}
                margin={"0 7px 0 0"}
              />}
            content="Car"
            position='top center'
            inverted
            style={{ borderRadius: '7px'}}
          />
          <Popup
            trigger={
              <EmptySpace width="38px" height="38px" position="relative">
                <Box height="100%">
                  <StyledIcon 
                    padding="0 0 0 0" 
                    overridecolor={PETROL_1} 
                    name="male"
                    size="large"
                    position="absolute"
                  />
                </Box>
              </EmptySpace>}
            content="Foot"
            position='top center'
            inverted
            style={{ borderRadius: '7px'}}
          />
        </Box>
        <StyledDivider />
        {locations.map((item: Location, index: number) => {
          return (
            <InputRow
              key={index}
              rowKey={item.name}
              index={index}
              coords={{lat: item.lat, lng: item.lng}}
              placeholder={item.placeholder}
              iconName={item.marker} 
              updatePoint={updatePoint}
            />
          )
        })}
      </Box>
    </PanelWrapper>
  )
}

export default Panel
