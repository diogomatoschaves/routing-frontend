import React from 'react'
import styled from 'styled-components'
import { colors } from '../utils/colours'

const Wrapper: any = styled.div`
  font-size: 17px;
  position: absolute;
  bottom: 0;
  left: 150px;
` as any

const Item: any = styled.div`
  display: inline-block;
  padding: 5px;
  margin: 0;
  background: ${(props: any) => (props.background ? props.background : 'white')};
` as any

const items = [
  '90+',
  '80-90',
  '70-80',
  '60-70',
  '50-60',
  '40-50',
  '30-40',
  '20-30',
  '10-20',
  '< 10'
]

export default function TrafficLegend() {
  return (
    <Wrapper>
      <Item>km/h:</Item>
      {items &&
        items.map((item: string, id: number) => (
          <Item key={id} background={colors[item]}>
            {item}
          </Item>
        ))}
    </Wrapper>
  )
}
