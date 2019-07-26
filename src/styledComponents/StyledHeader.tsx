import styled, { css } from 'styled-components'
import { Header } from 'semantic-ui-react'

const StyledHeader = styled(Header)`
  &.ui.header {
    margin-top: 10px;
    align-self: flex-start;
    font-family: "BasisGrotesque Medium", Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    ${(props: any) =>
      props.overridecolor &&
      css`
        color: ${props.overridecolor};
      `}
    &:first-child {
      margin-top: 12px;
    }
  }
`

export default StyledHeader