import React, { useEffect, useState } from 'react'
import { Box } from '../styledComponents'
import { Coords, LocationInfo, UpdatePoint, UpdateState } from '../types'
import BackgroundIcon from './BackgroundIcon'
import ControlledInput from './ControlledInput'
import { removeWaypoint } from '../utils/functions'

interface Props {
  rowKey: string
  index: number
  coords: Coords
  placeholder: string
  iconName: string | any
  updatePoint: UpdatePoint
  updateState: UpdateState
  urlMatchString: string
  loading: boolean
  defaultColor: string
  locations: LocationInfo[]
}

const diameter = 38

const InputRow = (props: Props) => {
  const {
    iconName,
    rowKey,
    index,
    coords,
    updatePoint,
    updateState,
    placeholder,
    urlMatchString,
    loading,
    defaultColor,
    locations
  } = props

  const [color, setColor] = useState(defaultColor)
  const [removeRow, setRemoveRow] = useState(false)

  useEffect(() => {
    setColor(props.defaultColor)
  })

  const removeAllowed = locations.length > 2

  return (
    <Box
      direction="row"
      justify="space-around"
      padding="10px 0"
      onMouseEnter={() => setRemoveRow(true)}
      onMouseLeave={() => setRemoveRow(false)}
    >
      <BackgroundIcon
        onClick={() =>
          removeAllowed && updateState('locations', removeWaypoint(locations, index))
        }
        diameter={diameter}
        color={color}
        iconColor={'white'}
        circle={true}
        iconName={removeAllowed && removeRow ? 'remove' : iconName}
        margin={'0 10px 0 0'}
        loading={loading}
        cursor="pointer"
      />
      <ControlledInput
        rowKey={rowKey}
        index={index}
        coords={coords}
        updatePoint={updatePoint}
        updateColor={setColor}
        placeholder={placeholder}
        urlMatchString={urlMatchString}
        defaultColor={defaultColor}
      />
    </Box>
  )
}

export default InputRow
