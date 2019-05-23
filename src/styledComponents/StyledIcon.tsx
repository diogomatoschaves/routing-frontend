import styled, { css } from 'styled-components'
import { Icon } from 'semantic-ui-react'


const StyledIcon: typeof Icon = styled(Icon as any)`

  &.icon {
    position: ${(props: any) => props.position && props.position};
    color: ${(props: any) => props.overridecolor ? props.overridecolor : 'black'};
    ${(props: any) => props.padding && css`padding:  ${props.padding};`}
    ${(props: any) => props.fontSize && css`font-size:  ${props.fontSize};`}
    ${(props: any) => props.height && css`height:  ${props.height};`}
  }

` as any

export default StyledIcon