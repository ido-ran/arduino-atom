'use babel';

import ArduinoView from './arduino-view';
import MyComponent from './my_component';
import { CompositeDisposable } from 'atom';
import { doCompile } from './master';

export default {

  arduinoView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    //this.arduinoView = new ArduinoView(state.arduinoViewState);
    this.myComp = new MyComponent({greeting: 'wow'});
    this.arduinoView = this.myComp.element;
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
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.arduinoView.destroy();
  },

  serialize() {
    return {
      arduinoViewState: this.arduinoView.serialize()
    };
  },

  toggle() {
    console.log('Arduino was toggled!');
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      this.modalPanel.show();
      this.initSubscriptions();
    }
  },

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

  },

  upload() {
    console.log('uploading...');
  },

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

};
