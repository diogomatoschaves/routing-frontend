import styled from 'styled-components'

const Box: any = styled.div`
  width: ${(props: any) => (props.width ? props.width : '100%')};
  height: ${(props: any) => props.height && props.height};
  padding: ${(props: any) => props.padding && props.padding};
  display: flex;
  flex-direction: ${(props: any) => (props.direction ? props.direction : 'column')};
  justify-content: ${(props: any) => props.justify && props.justify};
  align-items: ${(props: any) => (props.align ? props.align : 'center')};
` as any

export default Box
