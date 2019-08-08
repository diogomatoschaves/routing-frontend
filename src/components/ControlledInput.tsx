import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { UpdatePoint, Coords } from '../types'
import { formatCoords, splitCoords } from '../utils/functions'
import { StyledInput } from '../styledComponents'
import { NORMAL_INPUT, FOCUSED_INPUT } from '../utils/colours';

interface Props {
  updatePoint: UpdatePoint
  updateColor: any
  rowKey: string
  index: number
  coords: Coords
  placeholder: string
  history?: any
  location?: any
  urlMatchString: string
  color: string
}

interface State {
  value: string
}

class ControlledInput extends Component<Props & RouteComponentProps, State> {
  state = { 
    value: '',
  }

  componentDidMount() {
    const { coords } = this.props
    this.setState({ value: formatCoords(coords) })
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
    const { index, updatePoint, coords: prevCoords, updateColor, color } = this.props

    updateColor(color === NORMAL_INPUT ? FOCUSED_INPUT : NORMAL_INPUT )

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
    const { placeholder, updateColor, color } = this.props

    return (
      <StyledInput
        fluid
        value={value}
        onChange={(e, { value }) => this.handleChange(value)}
        onBlur={this.handleBlur}
        onFocus={() => updateColor(color === NORMAL_INPUT ? FOCUSED_INPUT : NORMAL_INPUT )}
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
