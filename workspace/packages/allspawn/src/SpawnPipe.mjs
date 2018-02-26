/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Capturer from './Capturer'
import SpawnShim from './SpawnShim'

export default class SpawnPipe extends SpawnShim {
  static maxBuffer0 = 200*1024

  constructor(o) {
    super(o)
    const {capture, stderrFails} = Object(o)
    const {options: options0} = this
    const {maxBuffer0} = SpawnPipe
    capture && (this.capture = true)
    stderrFails && (this.stderrFails = true)
    const options = options0 != null ? options0 : (this.options = {}) // where to store stdio value
    const {maxBuffer, silent, stdio: stdio0} = options
    if (options0 != null) {
      delete options.maxBuffer
      delete options.silent
    }
    this.maxBuffer = maxBuffer >= 0 ? +maxBuffer : maxBuffer0
    silent && (this.silent = true)
    const defOut = silent ? 'pipe' : 'inherit'
    const stdio = options.stdio = Array.isArray(stdio0) ? stdio0 : typeof(stdio0) === 'string' ? new Array(3).fill(stdio0) : ['ignore', defOut, defOut]
    if (capture) {
      stdio[1] = stdio[2] = 'pipe'
      if (stdio[0] === undefined) stdio[0] = 'ignore'
    } else if (stderrFails) {
      stdio[2] = 'pipe'
      if (stdio[0] === undefined) stdio[0] = 'ignore'
      if (stdio[1] === undefined) stdio[1] = 'ignore'
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
    const {cp, silent, stderrFails, maxBuffer} = this
    const [stdout, stderr] = await Promise.all(['stdout', 'stderr'].map(stream =>
      new Capturer({input: cp[stream], pipe: !silent && process[stream], maxBuffer}).capture()))
    const isStderr = stderrFails && !!stderr
    return {stdout, stderr, isStderr}
  }

  async doStderrFails() {
    const {cp: {stderr: stream}} = this
    const stderr = await new Promise((resolve, reject) => stream
      .once('data', text => text && resolve(text))
      .once('close', resolve)
      .setEncoding('utf8'))
    const isStderr = !!stderr
    return {stderr, isStderr}
  }
}
