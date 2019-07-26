import React, { Component } from 'react'
import styled from 'styled-components'
import { Box } from '../styledComponents'
import { OptionsHandler, UpdateState } from '../types';
import { MAIN_PETROL, PETROL_3 as TAB_COLOR } from '../utils/colours'


interface Props {
  tabsHandler: OptionsHandler
  updateState: UpdateState
  id: string
  width: string
  justify: string
}

export const Tab = styled(Box)`
  width: ${props => props.width};
  height: 40px;
  color: ${(props: any) => props.color ? `${TAB_COLOR}` : 'rgb(100, 100, 100)'};
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-bottom: ${(props: any) => props.border ? `3px solid ${MAIN_PETROL}` : 'none'};
` as any

export default class Tabs extends Component<Props, any> {
  render() {

    const { tabsHandler, updateState, id, width, justify } = this.props

    return (
      <Box direction="row" justify={justify}>
        {tabsHandler.options.map(item => (
          <Tab
            key={item.value}
            id={item.key}
            width={width}
            border={item.value === tabsHandler.activeIdx}
            color={item.value === tabsHandler.activeIdx}
            onClick={() => updateState(id, {
              ...tabsHandler,
              activeIdx: item.value
            })}
          >
            {item.text}
          </Tab>
        ))}
      </Box>
    )
  }
}
