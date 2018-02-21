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
    if (typeof args === 'string') {
      args && (this.cmd = args)
    } else if (Array.isArray(args)) {
      args[0] && (this.cmd = args[0])
      this.args = args.slice(1)
    } else args && (this.args = args)
    options && (this.options = options)
    this.killTimeout = killTimeout >= 0 ? +killTimeout : SpawnShim.killTimeout
    debug && (this.debug = true) && this.constructor === SpawnShim && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  spawn() {
    // options: cwd env argv0 stdio detached uid gid shell windowsVerbatimArguments windowsHide
    const {debug, cmd, args, options} = this
    let cp
    const setExit = () => (this.isExit = true) && debug && console.log(`${this.m} isExit`)
    const cpListener = () => setExit() + cp.removeListener('exit', cpListener).removeListener('error', cpListener)
    try {
      this.cp = cp = spawn(cmd, args, options).once('exit', cpListener).once('error', cpListener)
    } catch (e) {
      setExit()
      throw e
    }
    this.promise = new Promise((resolve, reject) => {
      let e
      cp.once('close', (status, signal) => resolve({e, status, signal}))
        .on('error', ee => !e && (e = ee)) // subsequent errors are ignored
    })
    return cp
  }

  async abortProcess() {
    const {cp, isExit, debug, killTimeout} = this
    const {killed} = cp || false
    debug && console.log(`${this.m} abortProcess: cp: ${!!cp} isExit: ${isExit} killed: ${killed}`)
    if (!cp || isExit) return

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
          debug && console.log(`${this.m} abortProcess: SIGKILL…`)
          cp.kill('SIGKILL') // kill -9
        } catch (e) {
          reject(e)
        }
      }
    })
    debug && console.log(`${this.m} abortProcess: exit complete: isExit: ${this.isExit}`)
  }
}
