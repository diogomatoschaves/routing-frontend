import React, { Component } from 'react'
import styled from 'styled-components'
import { Popup, Divider } from 'semantic-ui-react'
import { Box, StyledIcon, ColoredDiv, EmptySpace } from '../styledComponents'
import InputRow from './InputRow'
import { PETROL_4, PETROL_5, PETROL_2, PETROL_1, MAIN_GREY } from '../utils/colours'
import { UpdatePoint } from '../types'


const PanelWrapper: any = styled.div`
  position: absolute;
  z-index: 1000;
  width: 32%;
  min-width: 400px;
  max-width: 600px;
  max-height: 1000px;
  /* height: 250px; */
  left: 40px;
  top: 40px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.9);
  /* border: 1px solid rgb(205, 205, 205); */
  border-radius: 7px;
  box-shadow: 10px 10px 16px -9px rgba(77,77,77,0.4);
`

const StyledDivider = styled(Divider)`

  &.ui.divider {
    margin-top: 0.6rem;
    border-top: 1px solid rgb(0, 0, 0)
  }

  width: calc(100%);
`

const Panel: any = ({ updatePoint } : { updatePoint: UpdatePoint }) => {
  return (
    <PanelWrapper >
      <Box direction="column" justify="flex-start">
        <Box direction="row" justify="flex-start" padding="5px 0 15px 0">
          <Popup
            trigger={
              <ColoredDiv diameter="38" color={MAIN_GREY} margin="0 7px 0 0" position="relative">
                <Box height="100%">
                  <StyledIcon 
                    padding="0 0 0 0" 
                    overridecolor={PETROL_4} 
                    name="car"
                    size="large"
                    position="absolute"
                  />
                </Box>
              </ColoredDiv>}
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
        <InputRow 
          rowKey={'start'}
          placeholder={'Origin'}
          iconName="map marker alternate" 
          updatePoint={updatePoint}
        />
        <InputRow 
          rowKey={'end'}
          placeholder={'Destination'}
          iconName="flag checkered" 
          updatePoint={updatePoint}
        />
      </Box>
    </PanelWrapper>
  )
}

export default Panel
