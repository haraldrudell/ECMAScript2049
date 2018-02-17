/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import SpawnPipe from './SpawnPipe'
import Timer from './Timer'

export default class SpawnAsync extends SpawnPipe {
  static optionsProperties = Object.keys({timeout: 1})
  onTimeout = this.onTimeout.bind(this)

  static async spawnAsync(o) {
    return new SpawnAsync(o).startSpawn()
  }

  constructor(o) {
    super(Object.assign({name: 'SpawnAsync'}, o))
    const {cpReceiver, echo, nonZeroOk} = o || false
    echo && (this.echo = true)
    nonZeroOk && (this.nonZeroOk = true)
    cpReceiver && Object.assign(this, {cpReceiver})
    const {options, debug} = this
    const {timeout} = options
    this.timeout = timeout >= 0 ? +timeout : 0
    for (let p of SpawnAsync.optionsProperties) delete options[p]
    debug && console.log(`${this.m} constructor:`, this)
  }

  async startSpawn() {
    const {timeout, onTimeout, debug} = this
    const [result] = await Promise.all([
      this.launchProcess(),
    ].concat(timeout > 0
      ? [(this.timer = new Timer({timeout, onTimeout, debug})).start()]
      : []
    ))
    return result
  }

  async launchProcess() {
    const {echo, cmdString, cpReceiver, debug} = this

    // launch the child process
    echo && console.log(cmdString)
    const cp = this.spawn()
    cpReceiver && (cpReceiver.cp = cp)
    if (debug) {
      const cpEmit = cp.emit.bind(cp)
      cp.emit = (...args) => console.log('cpEvent:', args) + cpEmit(...args)
    }

    // await child process exit
    const [{e, status, signal}, {stdout, stderr, isStderr}] = await Promise.all([this.promise, this.startCapture()])

    // handle timeout
    const {isTimeout, timer, nonZeroOk} = this
    debug && console.log(`${this.m} process exit:`, {e, status, signal, stdout: stdout && stdout.length, stderr: stderr && stderr.length, isStderr, isTimeout, ss: stdout})
    if (isTimeout) {
      throw this.setErrorProps(new Error(`Process timeout: ${(this.timeout / 1e3).toFixed(1)} s: ${cmdString}`))
    } else timer && timer.cancel()

    // handle error from child process
    if (e) throw this.setErrorProps(e)
    if ((status && !nonZeroOk) || signal) throw this.getError({status, signal})

    if (isStderr) throw this.setErrorProps(new Error(`Output on standard error: ${cmdString}: '${stderr}'`), {stderr: this.trimEnd(stderr)})

    if (stdout === undefined) return status

    return {stdout, stderr}
  }

  onTimeout() {
    const {debug} = this
    debug && console.log(`${this.m}.onTimeout`)
    this.isTimeout = true
    return this.abortProcess()
  }

  trimEnd(s) {
    if (typeof s === 'string' && s.endsWith('\n')) return s.slice(0, -1)
    return s
  }

  getError({status, signal}) {
    const {cmdString} = this
    let msg = `status code: ${status}`
    if (signal) msg += ` signal: ${signal}`
    msg += ` '${cmdString}'`
    const e = new Error(msg)
    Object.assign(e, {status})
    if (signal) Object.assign(e, {signal})
    return this.setErrorProps(e)
  }

  setErrorProps(e, o) {
    const {cmd, args} = this
    return Object.assign(e, {cmd, args}, o)
  }
}
