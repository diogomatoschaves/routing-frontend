import React, { useEffect, useRef, useState } from 'react'
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import { Box } from '../styledComponents'
import { Coords, LocationInfo, UpdatePoint, UpdateState } from '../types'
import { removeWaypoint } from '../utils/functions'
import { ItemTypes } from '../utils/input'
import BackgroundIcon from './BackgroundIcon'
import ControlledInput from './ControlledInput'

interface Props {
  rowKey: string
  index: number
  coords: Coords
  placeholder: string
  iconName: string | any
  updatePoint: UpdatePoint
  updateState: UpdateState
  moveRow: (dragIndex: number, hoverIndex: number) => void
  urlMatchString: string
  loading: boolean
  defaultColor: string
  locations: LocationInfo[]
  itemDragging: number | null
  setItemDragging: any
}

interface DragItem {
  type: string
  index: number
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
    moveRow,
    placeholder,
    urlMatchString,
    loading,
    defaultColor,
    locations,
    setItemDragging,
    itemDragging
  } = props

  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.LOCATION, index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  })

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.LOCATION,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current!.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
      setItemDragging(hoverIndex)
    },
    drop(item: DragItem, monitor: DropTargetMonitor) {
      setItemDragging(null)
      updateState('dropEvent', true)
    }
  })

  const [color, setColor] = useState(defaultColor)
  const [removeRow, setRemoveRow] = useState(false)

  useEffect(() => {
    setColor(defaultColor)
  }, [defaultColor])

  useEffect(() => {
    if (isDragging) {
      setItemDragging(index)
      updateState('dropEvent', false)
    }
  }, [isDragging])

  const removeAllowed = locations.length > 2

  drag(drop(ref))

  return (
    <Box
      ref={ref}
      direction="row"
      justify="space-around"
      padding="10px 0"
      opacity={itemDragging === index ? '0' : '1'}
      cursor={'pointer'}
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
