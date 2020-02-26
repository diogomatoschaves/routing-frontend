import React from 'react'
import styled from 'styled-components'
import { Box, ColoredDiv, StyledIcon } from '../styledComponents'
import { Loader } from 'semantic-ui-react'

interface Props {
  diameter: number
  color?: string | undefined | boolean
  iconColor: string
  circle?: boolean
  iconName: any
  margin: string
  padding?: string
  cursor?: string
  loading?: boolean
  onClick?: any
  rotated?: 'clockwise' | 'counterclockwise'
}

const Wrapper: any = styled.div`
  margin: ${(props: any) => props.margin && props.margin};
`

export default function BackgroundIcon({
  diameter,
  color,
  iconColor,
  circle,
  iconName,
  margin,
  padding,
  cursor,
  loading,
  onClick,
  rotated
}: Props) {
  return (
    <Wrapper margin={margin} onClick={onClick}>
      <ColoredDiv
        circle={circle}
        diameter={diameter}
        color={color}
        position="relative"
        cursor={cursor}
      >
        <Box justify="center" height="100%" padding={padding}>
          {loading ? (
            <Loader active={true} inline={true} inverted={true} size={'small'} />
          ) : (
            <StyledIcon
              fontSize="25px"
              overridecolor={iconColor}
              name={iconName}
              position="absolute"
              rotated={rotated}
            />
          )}
        </Box>
      </ColoredDiv>
    </Wrapper>
  )
}
