import * as React from 'react'
import { Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import { PETROL_3 as COLOR } from '../utils/colours'

export const PropertyName = styled.div`
  color: ${COLOR};
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`

interface Props {
  title: string
  expanded?: boolean
}

interface State {
  isOpen: boolean
}

export default class ExpandableJSONProperty extends React.Component<Props, State> {
  public state = {
    isOpen: !!this.props.expanded
  }

  public render() {
    return (
      <React.Fragment>
        <PropertyName onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
          {this.props.title}
          {this.state.isOpen ? <Icon name="caret down" /> : <Icon name="caret right" />}
        </PropertyName>
        {this.state.isOpen ? this.props.children : null}
        {React.Children.count(this.props.children) === 0 && this.state.isOpen
          ? 'empty array'
          : null}
      </React.Fragment>
    )
  }
}
