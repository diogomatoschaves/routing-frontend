import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'
import styled from 'styled-components'
import { HandleValueUpdate, InputValues, UpdateState } from '../types'
import { PETROL_3 } from '../utils/colours'

interface Props {
  id: string
  handleValueUpdate?: HandleValueUpdate
  handleInputChange?: UpdateState
  rows: number
  color?: string
  editableValue: string
  placeholder?: string
  setInputRef?: (ref: any) => void
  inputValues: InputValues
}

const StyledForm = styled(Form)`
  width: 100%;

  &.ui.form textarea {
    width: 100%;
    font-size: 16px;
    border-radius: 7px;
    border: none;
    color: ${props => (props.color ? props.color : 'rgb(100, 100, 100)')};
    background-color: rgb(250, 250, 250);
    user-select: text;
    z-index: 1000;
    font-family: 'BasisGrotesque Light', Lato, 'Helvetica Neue', Arial, Helvetica,
      sans-serif !important;

    &:focus {
      background-color: rgb(248, 248, 248);
      color: ${props => (props.focuscolor ? props.focuscolor : 'black')};
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }
  }
`

export default function TextAreaInput({
  id,
  handleValueUpdate,
  handleInputChange,
  rows,
  color,
  editableValue,
  placeholder,
  setInputRef,
  inputValues
}: Props) {
  return (
    <StyledForm color={color} focuscolor={PETROL_3}>
      <TextArea
        ref={input => setInputRef && setInputRef(input)}
        id={id}
        className={'textarea'}
        placeholder={placeholder ? placeholder : ''}
        rows={rows}
        value={editableValue}
        onChange={(e, { id: newId, value }) =>
          handleInputChange &&
          handleInputChange('inputValues', {
            ...inputValues,
            [newId]: value
          })
        }
        onFocus={(e: any) => !handleInputChange && e.target.select()}
        onBlur={() =>
          handleValueUpdate && handleValueUpdate({ id, value: editableValue })
        }
      />
    </StyledForm>
  )
}
