import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import ProfileToggler from './ProfileToggler'
import JsonRenderer from './JsonRenderer'
import { Button, Dropdown, TextArea, Form, Header, Icon } from 'semantic-ui-react'
import { Box } from '../styledComponents'
import {
  RouteResponse,
  Body,
  UpdateState,
  UpdatePoint,
  Location,
  MatchResponse
} from '../types'
import { MAIN_PETROL, PETROL_3 } from '../utils/colours'
import { capitalize } from '../utils/functions'
import { Schema } from '../utils/schemas/index'
import { Validator } from 'jsonschema'
import JSON5 from 'json5'


interface Props {
  handleHideClick: (e: any) => void
  response: RouteResponse | MatchResponse
  body: Body | undefined
  endpoint: string
  updateState: UpdateState
  updatePoint: UpdatePoint
  responseOption: string
  locations: Array<Location>
  defaultColor: string
  selectedService: number
  serviceOptions: any
}

interface State {
  bodyValue: string
  responseValue: string
  validator?: Validator
  responseColor: string
  bodyColor: string
  responseEdit: boolean
  bodyEdit: boolean
}

const StyledForm = styled(Form)`
  width: 100%;
  z-index: 0;

  &.ui.form textarea {
    width: 100%;
    font-size: 16px;
    border-radius: 7px;
    border: none;
    color: ${props => (props.color ? props.color : 'rgb(100, 100, 100)')};
    background-color: rgb(242, 242, 242);
    user-select: text;
    z-index: 1000;

    &:focus {
      background-color: rgb(248, 248, 248);
      color: ${props => (props.focuscolor ? props.focuscolor : 'black')};
      /* border-radius: 7px; */
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }
  }
`

const StyledHeader = styled(Header)`
  &.ui.header {
    margin-top: 10px;
    align-self: flex-start;
    ${(props: any) =>
      props.overridecolor &&
      css`
        color: ${props.overridecolor};
      `}
    &:first-child {
      margin-top: 12px;
    }
  }
`

const StyledDropdown = styled(Dropdown)`
  &.ui.selection.dropdown {
    color: rgb(100, 100, 100);
    border-color: rgb(242, 242, 242);
    background-color: rgb(242, 242, 242);
  }
`

const StyledButton = styled(Button)`
  &.ui.button {
    padding: 7px;
    ${props =>
      props.marginleft &&
      css`
        margin-left: ${props.marginleft};
      `}
    &.icon {
      background-color: ${MAIN_PETROL};
      color: white;
      padding: 7px;
    }
    
  }
`

export default class OptionsPanel extends Component<Props, State> {
  static defaultProps = {
    defaultColor: 'rgb(100, 100, 100)'
  }

  state = {
    bodyValue: '{}',
    responseValue: '{}',
    selectedService: 0,
    validator: new Validator(),
    responseColor: 'rgb(100, 100, 100)',
    bodyColor: 'rgb(100, 100, 100)',
    responseEdit: false,
    bodyEdit: false
  }

  componentDidMount() {
    const { validator } = this.state
    const { response, body } = this.props

    Promise.resolve(
      Object.keys(Schema.Route).forEach((obj: any) => {
        validator.addSchema(Schema.Route[obj], `/${obj}`)
      })
    ).then(() => {
      Object.keys(Schema.Match).forEach((obj: any) => {
        validator.addSchema(Schema.Match[obj], `/${obj}`)
      })
    })

    this.setState({ 
      validator, 
      bodyValue: JSON5.stringify(body, null, 2),
      responseValue: JSON5.stringify(response, null, 2), 
    })
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { body, response, defaultColor } = this.props
    const { responseEdit, bodyEdit } = this.state

    if (prevProps.body !== body || (prevState.bodyEdit !== bodyEdit && !bodyEdit)) {
      this.setState({
        bodyValue: JSON5.stringify(body, null, 2),
        bodyColor: defaultColor
      })
    }

    if (
      prevProps.response !== response ||
      (prevState.responseEdit !== responseEdit && !responseEdit)
    ) {
      this.setState({
        responseValue: JSON5.stringify(response, null, 2),
        responseColor: defaultColor
      })
    }
  }

  handleInputChange = ({ id, value }: { id: string; value: any }): void => {
    this.setState(state => ({
      ...state,
      [id]: value
    }))
  }

  handleBlur = ({ id, value }: { id: string; value: any }): void => {
    const { validator, selectedService } = this.state
    const {
      updateState,
      updatePoint,
      responseOption,
      locations,
      defaultColor,
      serviceOptions
    } = this.props

    const service = serviceOptions[selectedService].key
    this.processJSON(
      value,
      validator,
      updateState,
      updatePoint,
      service,
      id.includes('response') ? 'response' : 'body',
      responseOption,
      locations,
      defaultColor
    )
  }

  processJSON = (
    value: any,
    validator: Validator,
    updateState: UpdateState,
    updatePoint: UpdatePoint,
    service: string,
    inputType: string,
    responseOption: string,
    locations: Array<Location>,
    defaultColor: string
  ) => {
    let parsedValue
    try {
      parsedValue = JSON5.parse(value)
    } catch (error) {
        console.log('Invalid JSON')
        this.setState(state => ({
          ...state,
          [`${inputType}Color`]: 'red'
        }))
        return null
    }
    const validation = validator.validate(
      parsedValue,
      Schema[service][capitalize(inputType)]
    )
    if (validation.valid) {
      if (inputType === 'response') {
        this.processValidResponse(
          updateState,
          updatePoint,
          responseOption,
          locations,
          parsedValue
        )
      } else {
        this.processValidBody(updatePoint, locations, parsedValue)
      }

      this.setState(state => ({
        ...state,
        [`${inputType}Color`]: defaultColor
      }))
    } else {
      this.setState(state => ({
        ...state,
        [`${inputType}Color`]: 'red'
      }))
    }
  }

  processValidResponse = (
    updateState: UpdateState,
    updatePoint: UpdatePoint,
    responseOption: string,
    locations: Array<Location>,
    parsedValue: any
  ) => {
    const points: any = {
      start: parsedValue.locations[0].location,
      end: parsedValue.locations.slice(-1)[0].location
    }

    if (
      [locations[0], locations.slice(-1)[0]].some(el => {
        return el.lat !== points[el.name].lat || el.lng !== points[el.name].lon
      })
    ) {
      new Promise(resolve => {
        resolve(updateState('recalculate', false))
      }).then((value) => {
        updatePoint([0, 1], [
          { lat: points.start.lat, lng: points.start.lon },
          { lat: points.end.lat, lng: points.end.lon }
        ])
      })

      updateState(
        responseOption === 'normal' ? 'response' : 'trafficResponse',
        parsedValue
      )
    }
  }

  processValidBody = (
    updatePoint: UpdatePoint,
    locations: Array<Location>,
    parsedValue: any
  ) => {
    const points: any = {
      start: parsedValue.locations[0],
      end: parsedValue.locations.slice(-1)[0]
    }

    if (
      [locations[0], locations.slice(-1)[0]].some(el => {
        return el.lat !== points[el.name].lat || el.lng !== points[el.name].lon
      })
    ) {
      updatePoint([0, 1], [
        { lat: points.start.lat, lng: points.start.lon },
        { lat: points.end.lat, lng: points.end.lon }
      ])
    }
  }

  updateState = (id: string) => {
    this.setState((state: any) => ({
      ...state,
      [id]: !state[id]
    }))
  }

  render() {
    const {
      endpoint,
      updateState,
      responseOption,
      response,
      body,
      selectedService,
      serviceOptions
    } = this.props

    const {
      bodyValue,
      responseValue,
      responseColor,
      responseEdit,
      bodyEdit,
      bodyColor
    } = this.state

    return (
      <Box>
        <Box
          padding="30px 10px 0 0"
          height={'70px'}
          direction="row"
          justify="space-around"
        >
          <Box width="35%" padding="0 0 0 3%">
            <StyledDropdown
              placeholder="Select Service"
              id={'selectedService'}
              fluid
              selection
              options={serviceOptions}
              value={selectedService}
              onChange={(e: any, { id, value }: any) => updateState(id, value)}
            />
          </Box>
          <Box width="35%">
            {serviceOptions[selectedService].key === 'Route' && (
              <ProfileToggler
                updateState={updateState}
                id={'responseOption'}
                responseOption={responseOption}
              />
            )}
          </Box>
        </Box>
        <Box width="80%" padding="10px 0 10px 0">
          <StyledHeader overridecolor={MAIN_PETROL}>Request Endpoint</StyledHeader>
          <StyledForm focuscolor={PETROL_3}>
            <TextArea id={'endpointValue'} rows={1} value={endpoint} readOnly disabled />
          </StyledForm>
        </Box>
        <Box width="80%" padding="10px 0 10px 0">
          <Box direction="row" justify="flex-start">
            <Box direction="row" justify="flex-start">
              <StyledHeader overridecolor={MAIN_PETROL}>Request Body</StyledHeader>
              <StyledButton
                id={'bodyEdit'}
                onClick={(e: any, { id }: { id: string }) => this.updateState(id)}
                marginleft={'10px'}
                icon={bodyEdit}
                className="body-textarea"
              >
                {bodyEdit ? <Icon name={'check'} /> : 'Edit'}
              </StyledButton>
            </Box>
          </Box>
          <JsonRenderer
            value={body}
            editableValue={bodyValue}
            id={'bodyValue'}
            editJson={bodyEdit}
            handleBlur={this.handleBlur}
            handleInputChange={this.handleInputChange}
            rows={10}
            color={bodyColor}
          />
        </Box>
        <Box width="80%" padding="10px 0 10px 0">
          <Box direction="row" justify="flex-start">
            <StyledHeader overridecolor={MAIN_PETROL}>Response</StyledHeader>
            <StyledButton
              id={'responseEdit'}
              onClick={(e: any, { id }: { id: string }) => this.updateState(id)}
              marginleft={'10px'}
              icon={responseEdit}
              className="response-textarea"
            >
              {responseEdit ? <Icon name={'check'} /> : 'Edit'}
            </StyledButton>
          </Box>
          <JsonRenderer
            value={response}
            editableValue={responseValue}
            id={'responseValue'}
            editJson={responseEdit}
            handleBlur={this.handleBlur}
            handleInputChange={this.handleInputChange}
            rows={15}
            color={responseColor}
          />
        </Box>
      </Box>
    )
  }
}
