'use babel';
/** @jsx etch.dom */

import etch from 'etch'

export default class ArduinoDevPane {
  constructor (properties) {
    this.properties = properties

    this.state = {
      board: null,
      comPort: null
    }

    this.props = {
      boards: properties.boards,
      comPorts: []
    }

    etch.initialize(this)
    this.refs.boardSelect.onchange = this.handleBoardSelected
    console.log('output text-editor', this.refs.buildOutputTextEditor)
  }

  handleBoardSelected(e) {
    console.log('board selected :)', e);
  }

  render () {
    const boardOptions =
      this.props.boards.map(board => {
          return (
            <option value="{board.id}">{board.name}</option>
          )
      })

    return (
      <div style="display:flex; flex-direction:column;">

        <div style="display:flex; flex-direction:row;">
          <button>Compile</button>
          <button>Upload</button>
        </div>

        <select ref="boardSelect">
          {boardOptions}
        </select>

        <select ref="comSelect">
          <option value="1">COM3</option>
          <option value="2">COM78</option>
          <option value="3">/dev/tty/cusmusdev-997</option>
        </select>

        <atom-text-editor ref="buildOutputTextEditor"></atom-text-editor>
      </div>
    )
  }

  update (newProperties) {
    if (this.properties.greeting !== newProperties.greeting) {
      this.properties.greeting = newProperties.greeting
      return etch.update(this)
    } else {
      return Promise.resolve()
    }
  }

  setCOMPorts(comPorts) {
    this.props.comPorts = comPorts;
    return etch.update(this)
  }
}
