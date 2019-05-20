import styled, { css } from 'styled-components'
import { Input, Icon } from 'semantic-ui-react'


export const StyledInput: typeof Input = styled(Input as any)`
  &.ui.input > input {
    border-radius: 7px;
    border: none;
    height: 40px;
    background-color: rgb(240, 240, 240)
  }
` as any

export const Box: any = styled.div`
  width: 100%;
  padding: ${(props: any) => props.padding && props.padding};
  display: flex;
  flex-direction: ${(props: any) => props.direction ? props.direction : 'column'}
  justify-content: ${(props: any) => props.justify ? props.justify : 'center'}
  align-items: ${(props: any) => props.align ? props.align : 'center'}
` as any

export const StyledIcon: typeof Icon = styled(Icon as any)`
  color: ${(props: any) => props.overridecolor ? props.overridecolor : 'black'}
  ${(props: any) => props.paddingright && css`padding-right:  ${props.paddingright}px;`}
` as any