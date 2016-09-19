'use babel';

import ArduinoView from './arduino-view';
import ArduinoDevPane from './arduino-dev-pane';
import { CompositeDisposable } from 'atom';
import { doCompile, getBoards } from './master';

class ArduinoPlugin {

  constructor() {
    this.arduinoView = null
    this.modalPanel = null
    this.subscriptions = null
    this.editorsMinimaps = null
  }

  activate(state) {
    //this.arduinoView = new ArduinoView(state.arduinoViewState);
    this.devPane = new ArduinoDevPane({boards: getBoards()});
    this.arduinoView = this.devPane.element;

    this.modalPanel = atom.workspace.addRightPanel({
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
  }

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.arduinoView.destroy();
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

  compile() {
    console.log('compling...');

    const code = 'void setup() { ; } \n void loop() { ; }',
          board = 'uno',
          sketch = 'test-sketch',
          cb = (err) => {
            if (err) console.log('fail to compile', err);
            else console.log('compile successeed');
          }
    doCompile(code, board, sketch, cb);
  }

  upload() {
    console.log('uploading...');
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
