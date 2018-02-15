/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import stream from 'stream'
const {Stream} = stream

export default class Capturer {
  text = ''
  onClose = this.onClose.bind(this)

  constructor(o) {
    const {input, pipe} = o || false
    if (!(input instanceof Stream)) throw new Error(`Capturer: input not stream: ${typeof input}`)
    this.promise = new Promise((resolve, reject) => (this._resolve = resolve) + (this._reject = reject))
    input.on('data', this.dataListener)
      .once('close', this.onClose)
      .setEncoding('utf8')
    if (pipe) {
      if (!(pipe instanceof Stream)) throw new Error(`Capturer: pipe not stream: ${typeof pipe}`)
      input.pipe(pipe)
    }
  }

  onClose() {
    this._resolve(this.text)
  }

  dataListener = text => this.saveText(text).catch(this._reject)

  async saveText(text) {
    this.text += text
  }
}
