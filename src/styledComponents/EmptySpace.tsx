import styled from 'styled-components'

const EmptySpace: any = styled.div`
  position: ${(props: any) => props.position && props.position};
  width: ${(props: any) => props.width && props.width};
  height: ${(props: any) => props.height && props.height};
` as any

export default EmptySpace