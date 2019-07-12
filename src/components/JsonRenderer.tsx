import React, { Component } from 'react'
import styled from 'styled-components'
import RecursiveJSONProperty from './RecursiveJSONProperty'
import { PETROL_3 } from '../utils/colours'
import { HandleChange } from '../types'
import { TextArea, Form } from 'semantic-ui-react'

interface Props {
  value: any
  id: string
  editJson: boolean
  handleBlur: HandleChange
  handleInputChange: HandleChange
  rows: number
  color: string,
  editableValue: string
}

const StyledForm = styled(Form)`
  width: 100%;

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

export default function JsonRenderer ({
  value,
  id,
  editJson,
  handleBlur,
  handleInputChange,
  rows,
  color,
  editableValue
}: Props) {

  return (
    <StyledForm color={color} focuscolor={PETROL_3}>
      {editJson ? (
        <TextArea
          id={id}
          className={'textarea'}
          rows={rows}
          value={editableValue}
          onChange={(e, { id, value }) => handleInputChange({ id, value })}
          onFocus={(e: any) => e.target.select()}
          onBlur={(e: any) => handleBlur({ id, value: editableValue })}
        />
      ) : (
        <RecursiveJSONProperty
          property={value}
          propertyName=""
          excludeBottomBorder={false}
          rootProperty={true}
        />
      )}
    </StyledForm>
  )
}
