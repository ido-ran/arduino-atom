'use babel';
/** @jsx etch.dom */

import etch from 'etch'
import {Emitter, CompositeDisposable} from 'atom'

export default class ArduinoDevPane {
  constructor (properties) {
    this.properties = properties

    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()

    this.state = {
      board: 'uno',
      comPort: null
    }

    this.props = {
      boards: properties.boards,
      comPorts: []
    }

    etch.initialize(this)

    this.refs.boardSelect.value=this.state.board

    this.handleBoardSelected = this.handleBoardSelected.bind(this)
    this.handleComPortSelected = this.handleComPortSelected.bind(this)
    this.handleReloadComPortsButton = this.handleReloadComPortsButton.bind(this)
    this.handleCompileButton = this.handleCompileButton.bind(this)
    this.handleUploadButton = this.handleUploadButton.bind(this)

    this.refs.boardSelect.onchange = this.handleBoardSelected
    this.refs.comPortSelect.onchange = this.handleComPortSelected
    this.refs.reloadComPortsButton.onclick = this.handleReloadComPortsButton
    this.refs.compileButton.onclick = this.handleCompileButton
    this.refs.uploadButton.onclick = this.handleUploadButton
  }

  getSettings() {
    return {
      board: this.state.board,
      comPort: this.state.comPort
    }
  }

  onReloadComPorts(handler) {
    this.subscriptions.add(this.emitter.on('did-reload-com-ports', handler))
  }

  onCompile(handler) {
    this.subscriptions.add(this.emitter.on('compile', handler))
  }

  onUpload(handler) {
    this.subscriptions.add(this.emitter.on('upload', handler))
  }

  handleReloadComPortsButton(e) {
    this.emitter.emit('did-reload-com-ports');
  }

  handleBoardSelected(e) {
    this.state.board = this.refs.boardSelect.value;
  }

  handleComPortSelected(e) {
    this.state.comPort = this.refs.comPortSelect.value;
  }

  handleCompileButton(e) {
    this.emitter.emit('compile', this.getSettings())
  }

  handleUploadButton(e) {
    this.emitter.emit('upload', this.getSettings())
  }

  render () {
    const boardOptions =
      this.props.boards.map(board => {
          return (
            <option value={board.id}>{board.name}</option>
          )
      })

    const comPortsOptions =
      this.props.comPorts.map(port => {
        return (
          <option value={port.comName}>{port.comName}</option>
        )
      })

    return (
      <div className="arduino" style="display:flex; flex-direction:column;">

        <div style="display:flex; flex-direction:row;">
          <button ref="compileButton" className="btn">Compile</button>
          <button ref="uploadButton" className="btn">Upload</button>
        </div>

        <select ref="boardSelect" className="form-control">
          {boardOptions}
        </select>

        <div style="display:flex; flex-direction:row;">
          <select ref="comPortSelect" className="form-control">
            {comPortsOptions}
          </select>
          <button className="btn icon icon-eye" ref="reloadComPortsButton" />
        </div>

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
    this.props.comPorts = comPorts
    if (!this.state.comPort && this.props.comPorts && this.props.comPorts.length) {
      this.state.comPort = comPorts[0].comName
    }
    return etch.update(this)
  }

  showOutput(output) {
    this.refs.buildOutputTextEditor.model.setText(output)
  }

  destroy() {
    this.subscriptions.dispose()
  }
}
