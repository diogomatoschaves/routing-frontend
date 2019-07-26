import styled from 'styled-components'
import { Divider } from 'semantic-ui-react'

const StyledDivider = styled(Divider)`
  &.ui.divider {
    margin-top: 0.6rem;
    border-top: 1px solid rgb(230, 230, 230);
  }

  width: ${props => props.width ? props.width : '100%'};
`

export default StyledDivider