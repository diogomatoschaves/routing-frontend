import React from 'react'
import styled from 'styled-components'
import { StyledSegment } from '../styledComponents'

interface Props {
  message: string | null
}

const StyledMessage = styled(StyledSegment)`
  &.ui.segment {
    font-size: 1.1em;
    margin: 3px;
  }
`

export default function Message({ message }: Props) {
  return (
    <StyledMessage padded>
      {message}
    </StyledMessage>
  )
}
