/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import SpawnPipe from './SpawnPipe'

import util from 'util'

export default class SpawnAsync extends SpawnPipe {
  static async spawnAsync(o) {
    return new SpawnAsync(o).startSpawn()
  }

  constructor(o) {
    super({name: 'SpawnAsync', ...o})
    const {cpReceiver, echo, nonZeroOk, debug} = Object(o)
    const {options} = this
    const {timeout} = options
    echo && (this.echo = true)
    nonZeroOk && (this.nonZeroOk = true)
    cpReceiver && (this.cpReceiver = cpReceiver)
    if (timeout != null) {
      timeout > 0 && (this.timeout = +timeout)
      delete options.timeout
    }
    debug && this.constructor === SpawnAsync && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async startSpawn() {
    return (await Promise.all([
      this.launchProcess(),
      this.setTimer(),
    ]))[0]
  }

  async launchProcess() {
    const {echo, cpReceiver, debug} = this

    // launch the child process
    echo && console.log(this.cmdString())
    const {cp, promise} = this.spawn()
    cpReceiver && (cpReceiver.cp = cp)

    // await child process exit
    const [{e, status, signal}, {stdout, stderr, isStderr}] = await Promise.all([promise, this.startCapture()])
    const {isTimeout, timeout, clearTimer, nonZeroOk} = this
    debug && console.log(`${this.m} process exit:`, {e, status, signal, stdout: stdout && stdout.length, stderr: stderr && stderr.length, isStderr, isTimeout, ss: stdout})

    // handle timeout
    if (isTimeout) throw this.setErrorProps(new Error(`Process timeout: ${(timeout / 1e3).toFixed(1)} s: ${this.cmdString()}`))
    else clearTimer && clearTimer()

    // handle error from child process
    const eText = stderr && this.trimEnd(stderr)
    if (e) throw this.setErrorProps(e, eText)
    if ((status && !nonZeroOk) || signal) throw this.getError({status, signal}, eText)
    if (isStderr) throw this.setErrorProps(new Error(`Output on standard error: ${this.cmdString()}: '${eText}'`), eText)

    return stdout === undefined ? status : {stdout, stderr}
  }

  setTimer() {
    const {timeout} = this
    return timeout && new Promise((resolve, reject) => {
      const timer = setTimeout(() => this._onTimeout().then(resolve, reject), timeout)
      this.clearTimer = () => clearTimeout(timer) + resolve()
    })
  }

  async _onTimeout() {
    const {debug} = this
    debug && console.log(`${this.m} child process timeout`)
    this.isTimeout = true
    return this.abortProcess()
  }

  trimEnd(s) {
    return typeof s === 'string' && s.endsWith('\n') ? s.slice(0, -1) : s
  }

  getError({status, signal}, stderr) {
    this.setErrorProps(new Error(`status code: ${status}${signal ? ` signal: ${signal}` : ''} '${this.cmdString()}'`),
      stderr, Object.assign({status}, signal ? {signal} : null))
  }

  setErrorProps(e, stderr, o) {
    const {cmd, args} = this
    return Object.assign(e, {cmd, args}, o, stderr ? {stderr} : null)
  }

  cmdString() {
    const {cmd, args} = this
    return `${cmd || ''} ${Array.isArray(args) ? args.join('\x20') : ''}`
  }
}
