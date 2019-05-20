import React, { Component } from 'react'
import styled from 'styled-components'
import { Popup } from 'semantic-ui-react'
import { Box, StyledIcon, Circle, EmptySpace } from '../styledComponents'
import InputRow from './InputRow'
import { PETROL_4, PETROL_5, PETROL_2, PETROL_1, MAIN_GREY } from '../utils/colours'
import { UpdatePoint } from '../types'


const PanelWrapper: any = styled.div`
  position: absolute;
  z-index: 1000;
  width: 32%;
  max-width: 600px;
  max-height: 1000px;
  /* height: 250px; */
  left: 40px;
  top: 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgb(245, 245, 245);
  border-radius: 10px;
  box-shadow: 10px 10px 16px -9px rgba(77,77,77,0.4);
`

const Panel: any = ({ updatePoint } : { updatePoint: UpdatePoint }) => {
  return (
    <PanelWrapper >
      <Box direction="column" justify="flex-start">
        <Box direction="row" justify="flex-start" padding="10px 0">
          <Popup
            trigger={
              <Circle diameter="38" color={MAIN_GREY} margin="0 7px 0 0" position="relative">
                <Box height="100%">
                  <StyledIcon 
                    padding="0 0 0 0" 
                    overridecolor={PETROL_4} 
                    name="car"
                    size="large"
                    position="absolute"
                  />
                </Box>
              </Circle>}
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
