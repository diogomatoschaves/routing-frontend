import styled, { css } from 'styled-components'

const EmptySpace: any = styled.div`
  width: ${(props: any) => props.width && props.width};
  ${(props: any) =>
    props.position &&
    css`
      position: ${props.position};
    `}
  ${(props: any) =>
    props.height &&
    css`
      height: ${props.height};
    `}
` as any

export default EmptySpace
