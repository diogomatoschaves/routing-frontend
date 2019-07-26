import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import { UpdateState, HandleChange, HandleConfirmButton, OptionsHandler } from '../types'

interface Props {
  id: string
  colorId: string
  open: boolean
  setState: any
  children?: any
  value: string
  color?: string
  handleValueUpdate?: HandleChange
  handleConfirmButton?: HandleConfirmButton
  updateState: UpdateState
  addDataTabsHandler?: OptionsHandler
  editable?: boolean
  buttonText?: string
  title?: string
}

const ModalHOC = (ChildComponent: any) => {
  return class extends Component<Props> {
    inputRef: any

    constructor(props: Props) {
      super(props)
      this.setInputRef = this.setInputRef.bind(this)
    }

    setInputRef(ref: any) {
      this.inputRef = ref
    }

    componentDidUpdate(prevProps: Props) {
      const { open, updateState, id, colorId } = this.props

      if (prevProps.open !== open && open) {
        new Promise(resolve => {
          resolve(id === 'newRoute' && updateState(id, ''))
        }).then(() => updateState(colorId, 'rgb(100, 100, 100)'))

        this.inputRef.focus()
      }
    }

    render() {
      const { open, setState } = this.props

      return (
        <Modal
          size={'small'}
          open={open}
          onClose={() => setState(false)}
          closeOnEscape={false}
          dimmer={'blurring'}
          closeIcon={true}
          centered
        >
          <ChildComponent setInputRef={this.setInputRef} {...this.props} />
        </Modal>
      )
    }
  }
}

export default ModalHOC
