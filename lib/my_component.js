'use babel';
/** @jsx etch.dom */

import etch from 'etch'

export default class MyComponent {
  constructor (properties) {
    this.properties = properties
    etch.initialize(this)
  }

  render () {
    return <div>{this.properties.greeting} World!</div>
  }

  update (newProperties) {
    if (this.properties.greeting !== newProperties.greeting) {
      this.properties.greeting = newProperties.greeting
      return etch.update(this)
    } else {
      return Promise.resolve()
    }
  }
}
