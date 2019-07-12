import React, { Component } from 'react'
import { StyledDropdown } from '../styledComponents'
import { UpdateState, EndpointHandler } from '../types'

interface Props {
  updateState: UpdateState
  endpointHandler: EndpointHandler
}

export default class EndpointRow extends Component<Props> {
  state = { searchQuery: '' }

  render() {
    const { updateState, endpointHandler } = this.props
    const { searchQuery } = this.state

    return (
      <StyledDropdown
        options={ endpointHandler.options }
        placeholder="Choose endpoint"
        search={(_: any) => {
          return endpointHandler.options.filter((el: any, index) => index === 0 || !el['data-additional'])
        }}
        searchQuery={ searchQuery }
        selection
        fluid
        allowAdditions
        value={ endpointHandler.activeIdx }
        onAddItem={(_: any, { value }: any) => {
          const newEndpointId = endpointHandler.options.length;
          const newEndpointHandler = {
            options: [
              ...endpointHandler.options,
              {
                key: `addition_${newEndpointId}`,
                text: value,
                value: newEndpointId
              }
            ],
            activeIdx: newEndpointId
          }
          updateState('endpointHandler', newEndpointHandler);
        }}
        onFocus={() => this.setState({ searchQuery: endpointHandler.options[endpointHandler.activeIdx].text})}
        onSearchChange={(_: any, { searchQuery }: any) => this.setState({ searchQuery }) }
        onChange={(_: any, { value }: any) => {
          if (typeof value == 'number' && value < endpointHandler.options.length) { // if an existing option is selected
            updateState('endpointHandler', { ...endpointHandler, activeIdx: value });
            this.setState({ searchQuery: endpointHandler.options[value].text })
          }
        }}
      />
    )
  }
}
