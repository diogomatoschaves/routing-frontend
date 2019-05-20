import React, { Component } from 'react'
import styled from 'styled-components'
import { Box, StyledIcon } from '../styledComponents'
import InputRow from './InputRow'
import { PETROL_4 } from '../utils/colours'

// const StyledInput = styled(Input)`

const PanelWrapper: any = styled.div`
  position: absolute;
  z-index: 1000;
  width: 30%;
  max-width: 600px;
  height: 250px;
  left: 20px;
  top: 20px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 10px 10px 16px -9px rgba(77,77,77,0.88);
`

const Panel: any = (props: any) => {
  return (
    <PanelWrapper >
      <Box direction="column" justify="flex-start">
        <InputRow iconName="map marker alternate" color={PETROL_4}/>
        <InputRow iconName="flag checkered" color={PETROL_4}/>
      </Box>
    </PanelWrapper>
  )
}

export default Panel
