import * as React from 'react';
import styled from 'styled-components';
import { PETROL_3 as COLOR } from '../utils/colours'
import { Icon } from 'semantic-ui-react'

export const PropertyName = styled.div`
  color: ${COLOR};
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

interface Props {
  title: string;
  expanded?: boolean;
}

interface State {
  isOpen: boolean;
}

export default class ExpandableJSONProperty extends React.Component<Props, State> {
  state = {
    isOpen: !!this.props.expanded
  };

  render() {
    return (
      <React.Fragment>
        <PropertyName onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
          {this.props.title}
          {this.state.isOpen ? (
            <Icon name="caret up"/> 
            ) : (
            <Icon name="caret down"/>
          )}
        </PropertyName>
        {this.state.isOpen ? this.props.children : null}
        {React.Children.count(this.props.children) === 0 && this.state.isOpen ? 'empty array' : null}
      </React.Fragment>
    );
  }
}