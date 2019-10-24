import React, { Component, useState } from 'react'
import { Box } from '../styledComponents'
import { Coords, UpdatePoint } from '../types'
import { NORMAL_INPUT } from '../utils/colours'
import BackgroundIcon from './BackgroundIcon'
import ControlledInput from './ControlledInput'

interface Props {
  rowKey: string
  index: number
  coords: Coords
  placeholder: string
  iconName: string | any
  updatePoint: UpdatePoint
  urlMatchString: string
}

const diameter = 38

const InputRow = (props: Props) => {
  const [color, setColor] = useState(NORMAL_INPUT)

  const {
    iconName,
    rowKey,
    index,
    coords,
    updatePoint,
    placeholder,
    urlMatchString
  } = props

  return (
    <Box direction="row" justify="space-around" padding="10px 0">
      <BackgroundIcon
        diameter={diameter}
        color={color}
        iconColor={'white'}
        circle={true}
        iconName={iconName}
        margin={'0 10px 0 0'}
      />
      <ControlledInput
        rowKey={rowKey}
        index={index}
        coords={coords}
        updatePoint={updatePoint}
        updateColor={setColor}
        placeholder={placeholder}
        urlMatchString={urlMatchString}
        color={color}
      />
    </Box>
  )
}

export default InputRow
