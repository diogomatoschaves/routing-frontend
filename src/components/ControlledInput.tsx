import React, { Component } from 'react'
import styled from 'styled-components'
import { Input } from 'semantic-ui-react'
import {
  generatePath,
  matchPath,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import { UpdatePoint, UpdateColor, Coords } from '../types'
import { formatCoords, splitCoords, getPath } from '../utils/functions'

interface Props {
  updatePoint: UpdatePoint
  updateColor: UpdateColor
  rowKey: string
  index: number
  coords: Coords
  placeholder: string
  history?: any
  location?: any
  urlMatchString: string
}

interface State {
  value: string
}

const StyledInput: typeof Input = styled(Input as any)`
  width: 100%;

  &.ui.input > input {
    font-size: 16px;
    border-radius: 7px;
    border: none;
    height: 43px;
    color: rgb(100, 100, 100);
    background-color: rgb(242, 242, 242);

    &:focus {
      background-color: rgb(248, 248, 248);
    }
  }
` as any

class ControlledInput extends Component<Props & RouteComponentProps, State> {
  state = {
    value: ''
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { coords } = this.props

    if (prevProps.coords !== coords && coords.lat && coords.lng) {
      this.setState({ value: formatCoords(coords) })
    }
  }

  handleChange = (value: string): void => {
    this.setState({ value })
  }

  handleBlur = (): void => {
    const { value } = this.state
    const {
      index,
      updatePoint,
      updateColor,
      coords: prevCoords,
    } = this.props

    updateColor()

    const coords = splitCoords(value)

    if (coords && formatCoords(prevCoords) !== formatCoords(coords)) {
      updatePoint([index], [coords])
    } else if (value === '') {
      updatePoint([index], [{ lat: null, lng: null }])
    }
  }

  cleanInput = () => {
    const { index, updatePoint } = this.props
    this.setState({ value: '' }, () => updatePoint([index], [{ lat: null, lng: null }]))
  }

  public render() {
    const { value } = this.state
    const { placeholder, updateColor } = this.props

    return (
      <StyledInput
        fluid
        value={value}
        onChange={(e, { value }) => this.handleChange(value)}
        onBlur={this.handleBlur}
        onFocus={updateColor}
        placeholder={placeholder}
        icon={
          value !== ''
            ? { name: 'remove circle', link: true, onClick: this.cleanInput }
            : false
        }
      />
    )
  }
}

export default withRouter(ControlledInput)
