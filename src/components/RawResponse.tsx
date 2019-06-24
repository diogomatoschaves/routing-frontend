import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import ProfileToggler from './ProfileToggler'
import { Button, Icon, TextArea, Form, Header } from 'semantic-ui-react';
import { Box } from '../styledComponents';
import { Response, Body, UpdateState } from '../types'
import { MAIN_PETROL, PETROL_3 } from '../utils/colours'


interface Props {
  handleHideClick: () => void,
  response: Response,
  body: Body | undefined,
  endpoint: string,
  updateState: UpdateState,
  responseOption: string
}

interface State {
  bodyValue: string,
  responseValue: string
}

const StyledForm = styled(Form)`
  width: 100%;
  z-index: 1000;

  &.ui.form textarea {
    width: 100%;
    font-size: 16px;
    border-radius: 7px;
    border: none;
    color: rgb(100, 100, 100);
    background-color: rgb(242, 242, 242);
    user-select: text;
    z-index: 1000;

    &:focus {
      background-color: rgb(248, 248, 248);
      color: ${props => props.focuscolor ? props.focuscolor : 'black' };
      /* border-radius: 7px; */
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
    }
  }
`

const StyledHeader = styled(Header)`
  &.ui.header {
    margin-top: 10px;
    align-self: flex-start;
    ${(props: any) => props.overridecolor && css`color:  ${props.overridecolor};`}
    &:first-child {
      margin-top: 25px;
    }
  }
`

export default class RawResponse extends Component<Props, State> {

  state = {
    bodyValue: '',
    responseValue: ''
  }

  componentDidUpdate(prevProps: Props) {
    const { body, response } = this.props

    if (prevProps.body !== body) {
      this.setState({ bodyValue: JSON.stringify(body, null, 2) })
    }

    if (prevProps.response !== response) {
      this.setState({ responseValue: JSON.stringify(response, null, 2) })
    }
  }

  handleInputChange = ({ id, value }: { id: string, value: any }) => {
    this.setState(state => ({
      ...state, 
      [id]: value 
    }))
  }

  render() {

    const { handleHideClick, endpoint, updateState, responseOption } = this.props
    const { bodyValue, responseValue } = this.state

    return (
      <Box>
        <Box padding="15px 15px 0 0" direction="row" justify="space-between">
          <Box width="45%" padding="0 0 0 10%">
            <ProfileToggler 
              updateState={updateState}
              id={'responseOption'}
              responseOption={responseOption}
            />
          </Box>
          <Button icon onClick={handleHideClick}>
            <Icon size="big" name='chevron left' />
          </Button>
        </Box>
        <Box width="80%" padding="10px 0 10px 0">
          <StyledHeader overridecolor={MAIN_PETROL}>Request Endpoint</StyledHeader>
          <StyledForm focuscolor={PETROL_3}>
            <TextArea 
              id={'endpointValue'} 
              rows={1} 
              value={endpoint} 
              readOnly 
              disabled 
            />
          </StyledForm>
        </Box>
        <Box width="80%" padding="10px 0 10px 0">
          <StyledHeader overridecolor={MAIN_PETROL}>Request Body</StyledHeader>
          <StyledForm focuscolor={PETROL_3}>
            <TextArea id={'bodyValue'} 
              rows={10} 
              value={bodyValue} 
              onChange={(e, { id, value }) => this.handleInputChange({ id, value })}/>
          </StyledForm>
        </Box>
        <Box width="80%" padding="10px 0 10px 0">
          <StyledHeader overridecolor={MAIN_PETROL}>Response</StyledHeader>
          <StyledForm focuscolor={PETROL_3}>
            <TextArea 
              id={'responseValue'} 
              rows={15} value={responseValue} 
              onChange={(e, { id, value }) => this.handleInputChange({ id, value })} /> 
          </StyledForm>
        </Box>
      </Box>
    )
  }
}
