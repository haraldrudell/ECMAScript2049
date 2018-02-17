/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Capturer from './Capturer'
import SpawnShim from './SpawnShim'

export default class SpawnPipe extends SpawnShim {
  static pipeOptions = Object.keys({maxBuffer: 1, silent: 1})
  static maxBuffer = 200*1024

  constructor(o) {
    super(o)
    const {capture, stderrFails} = o || false
    capture && (this.capture = true)
    stderrFails && (this.stderrFails = true)
    const options = this.options = {...this.options}
    for (let p of SpawnPipe.pipeOptions) if (options.hasOwnProperty(p)) {
      options[p] && (this[p] = true)
      delete options[p]
    }
    const {silent} = this
    const {stdio: stdio0} = options
    const stdio = options.stdio = Array.isArray(stdio0) ? stdio0 : typeof(stdio0) === 'string' ? new Array(3).fill(stdio0) : ['ignore', 'inherit', 'inherit']
    if (capture) {
      stdio[1] = stdio[2] = 'pipe'
      if (stdio[0] === undefined) stdio[1] = 'ignore'
    } else {
      if (silent) {
        stdio[1] = stdio[2] = 'ignore'
        if (stdio[0] === undefined) stdio[1] = 'ignore'
      }
      if (stderrFails) {
        stdio[2] = 'pipe'
        if (stdio[1] === undefined) stdio[1] = 'ignore'
        if (stdio[0] === undefined) stdio[1] = 'ignore'
      }
    }
  }

  async startCapture() {
    const {capture, stderrFails} = this
    return capture
      ? this.doCapture()
      : stderrFails
        ? this.doStderrFails()
        : {}
  }

  async doCapture() {
    const {cp, silent, stderrFails} = this
    const capturers = ['stdout', 'stderr'].map(stream => new Capturer({input: cp[stream], pipe: !silent && process[stream]}))
    const [stdout, stderr] = await Promise.all(capturers.map(c => c.promise))
    const isStderr = stderrFails && !!stderr
    return {stdout, stderr, isStderr}
  }

  async doStderrFails() {
    const {cp: {stderr: stream}} = this
    const stderr = await new Promise((resolve, reject) => stream
      .once('data', text => text && resolve(text))
      .once('close', () => resolve())
      .setEncoding('utf8'))
    const isStderr = !!stderr
    return {stderr, isStderr}
  }
}
