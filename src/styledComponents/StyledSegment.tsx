import styled, { css } from 'styled-components'
import { Segment } from 'semantic-ui-react'

const StyledSegment: any = styled(Segment as any)`

  ${(props: any) => props.width && css`width:  ${props.width};`}
  ${(props: any) => props.height && css`height:  ${props.height};`}

  ${(props: any) => props.top && css`top: ${props.top};`}
  ${(props: any) => props.bottom && css`bottom: ${props.bottom};`}
  ${(props: any) => props.left && css`left:  ${props.left};`}
  ${(props: any) => props.right && css`right:  ${props.right};`}

  ${(props: any) => props.background && css`background-color:  ${props.background};`}
  ${(props: any) => props.zindex && css`z-index:  ${props.zindex};`}

  color: ${(props: any) => props.overridecolor ? props.overridecolor : 'black'};
  ${(props: any) => props.padding && css`padding:  ${props.padding};`}
  ${(props: any) => props.fontSize && css`font-size:  ${props.fontSize};`}
  ${(props: any) => props.borderradius && css`border-radius:  ${props.borderradius};`}

  &.ui.segment {
    ${(props: any) => props.position && css`position: ${props.position};`}
    border: none;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 10px 10px 16px -9px rgba(77,77,77,0.5);
  }

` as any

export default StyledSegment