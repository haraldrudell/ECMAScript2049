/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import childProcess from 'child_process'
const {spawn} = childProcess
import util from 'util'

export default class SpawnShim {
  static killTimeout = 3e3

  constructor(o) {
    const {name, args, options, debug, killTimeout} = o || false
    this.m = String(name || 'SpawnShim')
    const isString = typeof args === 'string'
    const isArray = Array.isArray(args)
    const cmd = isString ? args : isArray && args[0]
    cmd && (this.cmd = cmd)
    (isArray && (this.args = args.slice(1))) || (!isString && args && (this.args = args))
    options && (this.options = options)
    this.killTimeout = killTimeout >= 0 ? +killTimeout : SpawnShim.killTimeout
    debug && (this.debug = true) && this.constructor === SpawnShim && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  spawn() {
    const {debug, cmd, args, options, m} = this
    let cp = this.cp = spawn(cmd, args, options).once('exit', listener).once('error', listener)
    this.promise = new Promise((resolve, reject) => {
      let e
      cp.once('close', (status, signal) => resolve({e, status, signal}))
        .on('error', ee => !e && (e = ee)) // subsequent errors are ignored
    })
    return cp

    function listener() {
      this.hadExit = true
      cp.removeListener('exit', listener).removeListener('error', listener)
      debug && console.log(`${m} process exited`)
    }
  }

  async abortProcess() {
    const {cp, hadExit, debug, killTimeout, m} = this
    const {killed} = cp || false
    debug && console.log(`${this.m} abortProcess: cp: ${!!cp} hadExit: ${hadExit} killed: ${killed}`)
    if (!cp || hadExit) return

    await new Promise((resolve, reject) => {
      cp.once('exit', listener).once('error', listener)
      if (!killed) {
        debug && console.log(`${this.m} cp.kill…`)
        cp.kill()
      }
      let timer = killTimeout && setTimeout(doSigKill, killTimeout)

      function listener() {
        cp.removeListener('exit', listener).removeListener('error', listener)
        timer && clearTimeout(timer)
        resolve()
      }
      function doSigKill() {
        try {
          timer = null
          debug && console.log(`${m} abortProcess: SIGKILL…`)
          cp.kill('SIGKILL') // kill -9
        } catch (e) {
          reject(e)
        }
      }
    })
    debug && console.log(`${this.m} abortProcess: exit complete: hadExit: ${this.hadExit}`)
  }
}
