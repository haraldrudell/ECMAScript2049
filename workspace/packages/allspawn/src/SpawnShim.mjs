/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import childProcess from 'child_process'
const {spawn} = childProcess
import util from 'util'

export default class SpawnShim {
  static killTimeout0 = 3e3

  constructor(o) {
    const {args, options, killTimeout, name, debug} = Object(o)
    const {killTimeout0} = SpawnShim
    this.m = String(name || 'SpawnShim')
    const isString = typeof args === 'string'
    const isArray = Array.isArray(args)
    const cmd = isString ? args : isArray && args[0]
    cmd && (this.cmd = cmd)
    isArray && (this.args = args.slice(1)) || (!isString && args && (this.args = args))
    options && (this.options = options)
    this.killTimeout = killTimeout >= 0 ? +killTimeout : killTimeout0
    debug && (this.debug = true) && this.constructor === SpawnShim && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  spawn() {
    const {cmd, args, options} = this
    const cp = this.cp = spawn(cmd, args, options) // may throw
    const promise = new Promise((resolve, reject) => {
      let e
      const exitListener = this.exitListener = async () => this._exitListener().catch(reject)
      cp.once('close', (status, signal) => resolve({e, status, signal}))
        .on('error', ee => !e && (e = ee)) // subsequent errors are ignored
        .once('exit', exitListener).once('error', exitListener)
    })
    return {cp, promise}
  }

  async _exitListener() {
    const {cp, exitListener, debug} = this
    this.hadExit = true
    this.exitListener = null
    cp && cp.removeListener('exit', exitListener).removeListener('error', exitListener)
    debug && console.log(`${this.m} process exited`)
  }

  async abortProcess() {
    const {cp, hadExit, debug, killTimeout} = this
    debug && console.log(`${this.m} abortProcess: cp: ${!!cp} hadExit: ${!!hadExit} killed: ${Object(cp).killed}`)
    if (!cp || hadExit) return

    let cancelTimer
    await Promise.all([
      new Promise((resolve, reject) => {
        const timer = killTimeout && setTimeout(() => this.doSigKill(cp).then(resolve, reject), killTimeout)
        cancelTimer = () => (timer && clearTimeout(timer)) + resolve()
      }),
      new Promise((resolve, reject) => {
        const onProcessExit = () => cp.removeListener('exit', onProcessExit).removeListener('error', onProcessExit) + cancelTimer() + resolve()
        cp.once('exit', onProcessExit).once('error', onProcessExit)
        this.maybeKill(cp)
      }),
    ])

    debug && console.log(`${this.m} abortProcess: exit complete: hadExit: ${this.hadExit}`)
  }

  maybeKill(cp) {
    const {debug} = this
    const {killed} = cp
    if (!killed) {
      debug && console.log(`${this.m} invoking cp.kill…`)
      cp.kill()
    }
  }

  async doSigKill(cp) {
    const {debug} = this
    debug && console.log(`${this.m} sending SIGKILL…`)
    cp.kill('SIGKILL') // kill -9
  }
}
