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
  cursor?: string
  loading?: boolean
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
  cursor,
  loading
}: Props) {
  return (
    <Wrapper margin={margin}>
      <ColoredDiv
        circle={circle}
        diameter={diameter}
        color={color}
        position="relative"
        cursor={cursor}
      >
        <Box justify="center" height="100%">
          {loading ? (
            <Loader active={true} inline={true} inverted={true} size={'small'} />
          ) : (
            <StyledIcon
              fontSize="25px"
              height="20px"
              overridecolor={iconColor}
              name={iconName}
              position="absolute"
            />
          )}
        </Box>
      </ColoredDiv>
    </Wrapper>
  )
}
