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
  height: ${(props: any) => props.height && props.height};
  padding: ${(props: any) => props.padding && props.padding};
  display: flex;
  flex-direction: ${(props: any) => props.direction ? props.direction : 'column'}
  justify-content: ${(props: any) => props.justify ? props.justify : 'center'}
  align-items: ${(props: any) => props.align ? props.align : 'center'}
` as any

export const StyledIcon: typeof Icon = styled(Icon as any)`

  &.icon {
    position: ${(props: any) => props.position && props.position};
    color: ${(props: any) => props.overridecolor ? props.overridecolor : 'black'};
    ${(props: any) => props.padding && css`padding:  ${props.padding};`}
  }

` as any

export const Circle: any = styled.div`
  position: ${(props: any) => props.position && props.position};
  width: ${(props: any) => props.diameter ? `${props.diameter}px` : '20px'};
  height: ${(props: any) => props.diameter ? `${props.diameter}px` : '20px'};
  border-radius: ${(props: any) => props.diameter ? `${Math.round(props.diameter / 2)}px` : '10px'};
  background-color: ${(props: any) => props.color ? props.color : 'black'};
  margin: ${(props: any) => props.margin && props.margin};
` as any

export const EmptySpace: any = styled.div`
  position: ${(props: any) => props.position && props.position};
  width: ${(props: any) => props.width && props.width};
  height: ${(props: any) => props.height && props.height};
`

