import React from 'react'
import { Box, StyledIcon, ColoredDiv } from '../styledComponents'


interface Props {
  diameter: number, 
  color: string,
  iconColor: string,
  circle: boolean, 
  iconName: any,
  margin: string
}

export default function BackgroundIcon({ diameter, color, iconColor, circle, iconName, margin } : Props) {
  return (
    <ColoredDiv circle={circle} diameter={diameter} color={color} margin={margin} position="relative">
      <Box height="100%" padding={`${Math.round(diameter / 2)}px`}>
        <StyledIcon 
          fontSize={'25px'}
          height={'20px'}
          padding="0 0 0 0" 
          overridecolor={iconColor} 
          name={iconName}
          position="absolute"
        />
      </Box>
    </ColoredDiv>
  )
}
