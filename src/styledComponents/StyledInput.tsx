import { Input } from 'semantic-ui-react'
import styled from 'styled-components'


const StyledInput: typeof Input = styled(Input as any)`
  width: 100%;

  &.ui.input > input {
    font-size: 16px;
    border-radius: 7px;
    border: none;
    height: 43px;
    color: rgb(100, 100, 100);
    background-color: rgb(242, 242, 242);

    &:focus {
      background-color: rgb(248, 248, 248);
    }
  }
` as any

export default StyledInput