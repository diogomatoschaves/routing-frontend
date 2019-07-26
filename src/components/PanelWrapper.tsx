import React, { Component } from 'react'

const PanelWrapper = (WrappedComponent: typeof Component) => (options: any={}) => {

  const JointComponent = class extends Component {
    

    render() {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  };

  return (
    <div></div>  
  )
}
