import styled, { css } from 'styled-components'
import { Icon } from 'semantic-ui-react'


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
    ${(props: any) => props.fontSize && css`font-size:  ${props.fontSize};`}
    ${(props: any) => props.height && css`height:  ${props.height};`}
  }

` as any

export const ColoredDiv: any = styled.div`
  position: ${(props: any) => props.position && props.position};
  width: ${(props: any) => props.diameter ? `${props.diameter}px` : '20px'};
  height: ${(props: any) => props.diameter ? `${props.diameter}px` : '20px'};
  border-radius: ${(props: any) => props.circle ? props.diameter ? `${Math.round(props.diameter / 2)}px` : '10px' :
    props.radius ? props.radius : '7px'};
  background-color: ${(props: any) => props.color ? props.color : 'black'};
  margin: ${(props: any) => props.margin && props.margin};
` as any

export const EmptySpace: any = styled.div`
  position: ${(props: any) => props.position && props.position};
  width: ${(props: any) => props.width && props.width};
  height: ${(props: any) => props.height && props.height};
`

