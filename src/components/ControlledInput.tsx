import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { StyledInput } from '../styledComponents'
import { Coords, UpdatePoint } from '../types'
import { FOCUSED_INPUT, NORMAL_INPUT } from '../utils/colours'
import { formatCoords, splitCoords } from '../utils/functions'

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
  public state = {
    value: ''
  }

  public componentDidMount() {
    const { coords } = this.props
    this.setState({ value: formatCoords(coords) })
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { coords } = this.props

    if (prevProps.coords !== coords) {
      if (coords.lat && coords.lon) {
        this.setState({ value: formatCoords(coords) })
      } else {
        this.setState({ value: '' })
      }
    }
  }

  public handleChange = (value: string): void => {
    this.setState({ value })
  }

  public handleBlur = (): void => {
    const { value } = this.state
    const { index, updatePoint, coords: prevCoords, updateColor, color } = this.props

    updateColor(color === NORMAL_INPUT ? FOCUSED_INPUT : NORMAL_INPUT)

    const coords = splitCoords(value)

    if (coords && formatCoords(prevCoords) !== formatCoords(coords)) {
      updatePoint([index], [coords])
    } else if (value === '') {
      updatePoint([index], [{ lat: null, lon: null }])
    }
  }

  public cleanInput = () => {
    const { index, updatePoint } = this.props
    this.setState({ value: '' }, () => updatePoint([index], [{ lat: null, lon: null }]))
  }

  public render() {
    const { value } = this.state
    const { placeholder, updateColor, color } = this.props

    return (
      <StyledInput
        fluid={true}
        value={value}
        onChange={(e, { value: newValue }) => this.handleChange(newValue)}
        onBlur={this.handleBlur}
        onFocus={() => updateColor(color === NORMAL_INPUT ? FOCUSED_INPUT : NORMAL_INPUT)}
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
