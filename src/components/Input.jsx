import React, { Component } from 'react'
import { TextInput } from 'grommet'

export default class Input extends Component {
  state = {
    test: ''
  }

  updateInput = event => {
    const { id } = event.target
    const { value } = event.target
    this.setState({
      [id]: value
    })
  }

  render() {
    const { test } = this.state

    return <TextInput id="test" value={test} onChange={e => this.updateInput(e)} />
  }
}
