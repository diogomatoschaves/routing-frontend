import React, { Component } from 'react'
import { StyledDropdown } from '../styledComponents'
import { OptionsHandler, UpdateState } from '../types'

interface Props {
  updateState: UpdateState
  endpointHandler: OptionsHandler
}

export default class EndpointRow extends Component<Props> {
  public state = { searchQuery: '' }

  public render() {
    const { updateState, endpointHandler } = this.props
    const { searchQuery } = this.state

    return (
      <StyledDropdown
        options={endpointHandler.options}
        placeholder="Choose endpoint"
        search={() => {
          return endpointHandler.options.filter(
            (el: any, index) => index === 0 || !el['data-additional']
          )
        }}
        searchQuery={searchQuery}
        selection={true}
        fluid={true}
        allowAdditions={true}
        value={endpointHandler.activeIdx}
        onAddItem={(_: any, { value }: any) => {
          const newEndpointId = endpointHandler.options.length
          const newEndpointHandler = {
            activeIdx: newEndpointId,
            options: [
              ...endpointHandler.options,
              {
                key: `addition_${newEndpointId}`,
                text: value,
                value: newEndpointId
              }
            ]
          }
          updateState('endpointHandler', newEndpointHandler)
        }}
        onFocus={() =>
          this.setState({
            searchQuery: endpointHandler.options[endpointHandler.activeIdx].text
          })
        }
        onSearchChange={(_: any, { searchQuery: newSearchQuery }: any) =>
          this.setState({ searchQuery: newSearchQuery })
        }
        onChange={(_: any, { value }: any) => {
          if (typeof value === 'number' && value < endpointHandler.options.length) {
            // if an existing option is selected
            updateState('endpointHandler', { ...endpointHandler, activeIdx: value })
            this.setState({ searchQuery: endpointHandler.options[value].text })
          }
        }}
      />
    )
  }
}
