import styled from 'styled-components'

const ColoredDiv: any = styled.div`
  position: ${(props: any) => props.position && props.position};
  width: ${(props: any) => props.diameter ? `${props.diameter}px` : '20px'};
  height: ${(props: any) => props.diameter ? `${props.diameter}px` : '20px'};
  border-radius: ${(props: any) => props.circle ? props.diameter ? `${Math.round(props.diameter / 2)}px` : '10px' :
    props.radius ? props.radius : '7px'};
  background-color: ${(props: any) => props.color ? props.color : 'black'};
  margin: ${(props: any) => props.margin && props.margin};
` as any

export default ColoredDiv