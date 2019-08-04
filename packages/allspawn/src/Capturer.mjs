/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import stream from 'stream'
const {Stream} = stream

export default class Capturer {
  text = ''

  constructor(o) {
    const {input, pipe} = Object(o)
    const m = 'Capturer'
    if (!(input instanceof Stream)) throw new Error(`${m}: input not stream: ${typeof input}`)
    this.input = input
    if (pipe) {
      if (!(pipe instanceof Stream)) throw new Error(`${m}: pipe not stream: ${typeof pipe}`)
      this.pipe = pipe
    }
  }

  async capture() {
    const {input, pipe} = this
    return new Promise((resolve, reject) =>
      input.on('data', text => this.saveText(text).catch(reject))
        .once('close', () => resolve(this.text))
        .setEncoding('utf8') +
      (pipe && input.pipe(pipe)))
  }

  async saveText(text) {
    this.text += text
  }
}
