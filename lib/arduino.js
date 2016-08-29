'use babel';

import ArduinoView from './arduino-view';
import { CompositeDisposable } from 'atom';

export default {

  arduinoView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.arduinoView = new ArduinoView(state.arduinoViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.arduinoView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'arduino:toggle': () => this.toggle()
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
  }

};
