import { Button } from 'semantic-ui-react'
import styled, { css } from 'styled-components'
import { lightenDarkenColor } from '../utils/functions'

const StyledButton = styled(Button)`
  &.ui.button {
    ${props =>
      props.width &&
      css`
        width: ${props.width};
      `};
    border-radius: 5px;
    display: flex;
    margin: 0;
    justify-content: center;
    align-items: center;
    transition: background-color 0.4s linear;
    font-family: "BasisGrotesque Medium", Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    ${props =>
      props.alignstart &&
      css`
        align-self: flex-start;
      `}
    ${props =>
      props.alignend &&
      css`
        align-self: flex-end;
      `}
    ${(props: any) =>
      props.backgroundcolor &&
      css`
        background-color: ${props.backgroundcolor} !important;
        color: white !important;
      `};

    &:hover {
      ${(props: any) =>
        props.backgroundcolor &&
        css`
          background-color: ${lightenDarkenColor(props.backgroundcolor, 25)} !important;
        `}
    }
  }
`

export default StyledButton
