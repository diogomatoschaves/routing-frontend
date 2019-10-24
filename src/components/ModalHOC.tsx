import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import {
  HandleConfirmButton,
  HandleDeleteRoute,
  HandleValueUpdate,
  InputColors,
  InputValues,
  OptionsHandler,
  Route,
  UpdateState
} from '../types'

interface Props {
  id?: string
  open: boolean
  setState: any
  children?: any
  inputValues: InputValues
  inputColors: InputColors
  handleValueUpdate?: HandleValueUpdate
  handleAddRoute?: HandleConfirmButton
  handleConfirmButton?: HandleConfirmButton
  handleDeleteRoute?: HandleDeleteRoute
  handleClickRoute?: HandleConfirmButton
  updateState: UpdateState
  addDataTabsHandler?: OptionsHandler
  editable?: boolean
  buttonText?: string
  title?: string
  addedRoutes?: Route[]
}

const ModalHOC = (ChildComponent: any) => {
  return class extends Component<Props> {
    public inputRef: any

    constructor(props: Props) {
      super(props)
      this.setInputRef = this.setInputRef.bind(this)
    }

    public setInputRef(ref: any) {
      this.inputRef = ref
    }

    public componentDidUpdate(prevProps: Props) {
      const { open, updateState, inputValues, inputColors, id } = this.props

      if (prevProps.open !== open && open) {
        new Promise(resolve => {
          const newInputValues = {
            ...inputValues,
            route: '',
            match: ''
          }
          resolve(id !== 'body' && updateState('inputValues', newInputValues))
        }).then(() => {
          const newInputColors = {
            ...inputColors,
            route: 'rgb(100, 100, 100)',
            match: 'rgb(100, 100, 100)',
            body: 'rgb(100, 100, 100)'
          }
          updateState('inputColors', newInputColors)
        })

        this.inputRef && this.inputRef.focus()
      }
    }

    public render() {
      const { open, setState } = this.props

      return (
        <Modal
          size={'small'}
          open={open}
          onClose={() => setState(false)}
          closeOnEscape={false}
          dimmer={'blurring'}
          closeIcon={true}
          centered={true}
        >
          <ChildComponent setInputRef={this.setInputRef} {...this.props} />
        </Modal>
      )
    }
  }
}

export default ModalHOC
