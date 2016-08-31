'use babel';

import ArduinoView from './arduino-view';
import { CompositeDisposable } from 'atom';
import { doCompile } from './master';

export default {

  arduinoView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.arduinoView = new ArduinoView(state.arduinoViewState);
    this.modalPanel = atom.workspace.addBottomPanel({
      item: this.arduinoView.getElement(),
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
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
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
  }

};
