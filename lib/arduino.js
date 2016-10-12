'use babel';

import ArduinoDevPane from './arduino-dev-pane';
import { CompositeDisposable } from 'atom';
import { doCompile, getBoards, listPorts } from './master';
import { upload } from './uploader';

class ArduinoPlugin {

  constructor() {
    this.arduinoView = null
    this.modalPanel = null
    this.subscriptions = null
    this.editorsMinimaps = null

    this._handleProgressEvent = this._handleProgressEvent.bind(this)
  }

  activate(state) {
    //this.arduinoView = new ArduinoView(state.arduinoViewState);
    this.devPane = new ArduinoDevPane({boards: getBoards()});
    this.arduinoView = this.devPane.element;

    this.devPane.onReloadComPorts(this.reloadComPorts.bind(this));
    this.devPane.onCompile(this.handleCompile.bind(this))
    this.devPane.onUpload(this.handleUpload.bind(this))

    this.modalPanel = atom.workspace.addBottomPanel({
      item: this.arduinoView,
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'arduino:toggle': () => this.toggle(),
      'arduino:compile': () => this.compile(),
      'arduino:upload': () => this.upload()
    }));

    this.reloadComPorts();
  }

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.arduinoView.destroy();
    this.devPane.destroy();
  }

  reloadComPorts() {
    listPorts((err, ports) => {
      this.devPane.setCOMPorts(ports)
    })
  }

  handleCompile(settings) {
    this.compile(settings)
  }

  handleUpload(settings) {
    this.upload(settings)
  }

  // serialize() {
  //   return {
  //     arduinoViewState: this.arduinoView.serialize()
  //   };
  // }

  toggle() {
    console.log('Arduino was toggled!');
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      this.modalPanel.show();
      this.initSubscriptions();
    }
  }

  _getSourceCode() {
    let srcCode = ""
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      srcCode = editor.getText()
    }

    return srcCode
  }

  compile(settings) {
    console.log('compling...');
    this.devPane.clearOutput()

    const code = this._getSourceCode(),
          board = settings.board,
          sketch = 'test-sketch',
          cb = (err) => {
            if (err) atom.notifications.addError('fail to compile', {
              detail: err.toString(),
              dismissable: true
            });
            else atom.notifications.addSuccess('compile successeed');
          }
    doCompile(code, board, sketch, cb, this._handleProgressEvent);
  }

  upload(settings) {
    console.log('uploading...');
    this.devPane.clearOutput()

    const code = this._getSourceCode(),
          board = settings.board,
          sketch = 'test-sketch',
          cb = (err, result) => {
            if (err) atom.notifications.addError('fail to compile\n\n' + err);
            else this._uploadHex(settings, result)
          }
    doCompile(code, board, sketch, cb, this._handleProgressEvent);
  }


  _handleProgressEvent(e) {
    const type = e.type
    const msg = e.message

    this.devPane.addOutput(msg)
  }

  _uploadHex(settings, compileResult) {
    //var sketch = path.join('build', 'out', req.body.sketch+'.hex');
    var hexFile = compileResult.hexFile
    var options = compileResult.options
    var publish = this._handleProgressEvent

    upload(hexFile, settings.comPort, options, publish, (err, result) => {
      if (err) atom.notifications.addError('fail to upload\n\n' + err);
      else atom.notifications.addSuccess('upload successeed');
    })
  }

  /**
    * Registers to the `observeTextEditors` method.
    *
    * @access private
    */
   initSubscriptions () {
     this.subscriptions.add(atom.workspace.observeTextEditors((textEditor) => {
       console.log('text editor observed', textEditor);
      //  let minimap = this.minimapForEditor(textEditor)
      //  let minimapElement = atom.views.getView(minimap)
       //
      //  this.emitter.emit('did-create-minimap', minimap)
       //
      //  minimapElement.attach()
     }))
   }

}

export default new ArduinoPlugin()
