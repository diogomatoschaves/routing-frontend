import React, { useState } from 'react'
import { StyledInput } from '../styledComponents'
import { FOCUSED_INPUT, NORMAL_INPUT } from '../utils/colours'

interface Props {
  value: string
  fetchResults: (value: string) => void
  setValue: (value: string) => void
  setInputRef: (ref: any) => void
}

export default function SearchInput({
  value,
  fetchResults,
  setValue,
  setInputRef
}: Props) {
  const [color, setColor] = useState(NORMAL_INPUT)

  return (
    <StyledInput
      ref={input => setInputRef(input)}
      fluid={true}
      value={value}
      onChange={(e, { value: newValue }) => {
        setValue(newValue)
        fetchResults(newValue)
      }}
      onFocus={() => setColor(color === NORMAL_INPUT ? FOCUSED_INPUT : NORMAL_INPUT)}
      placeholder={'Insert Route Id'}
      icon={
        value !== ''
          ? { name: 'remove circle', link: true, onClick: () => setValue('') }
          : false
      }
    />
  )
}
