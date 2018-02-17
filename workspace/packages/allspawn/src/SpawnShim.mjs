/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import childProcess from 'child_process'
const {spawn} = childProcess

export default class SpawnShim {
  static killTimeout = 3e3
  setExit = () => this.isExit = true

  constructor(o) {
    !o && (o = false)
    this.m = String(o.name || 'SpawnShim')
    const {args, options, debug, killTimeout} = o || false
    const isArray = Array.isArray(args)
    if (typeof args === 'string') this.cmd = args
    else {
      isArray && (this.cmd = args[0])
      this.args = isArray ? args.slice(1) : args
    }
    Object.assign(this, {debug, options})
    this.cmdString = `${this.cmd || ''} ${isArray ? this.args.join('\x20') : ''}`
    this.killTimeout = killTimeout >= 0 ? +killTimeout : SpawnShim.killTimeout
  }

  spawn() {
    // options: cwd env argv0 stdio detached uid gid shell windowsVerbatimArguments windowsHide
    const {cmd, args, options} = this
    const cp = this.cp = spawn(cmd, args, options)
      .once('exit', this.setExit)
      .once('error', this.setExit)
    this.promise = new Promise((resolve, reject) => {
      let e
      cp.once('close', (status, signal) => resolve({e, status, signal}))
        .on('error', ee => !e && (e = ee)) // subsequent errors are ignored
    })
    return cp
  }

  async abortProcess() {
    const {cp, isExit, debug, killTimeout, promise} = this
    debug && console.log(`${this.m} abortProcess: isExit: ${isExit}`)
    if (!cp || this.isExit) return

    if (!cp.killed) {
      debug && console.log(`${this.m} cp.kill…`)
      cp.kill()
    }

    if (killTimeout === 0) return promise
    let timer
    const isTimeout = await new Promise((resolve, reject) => {
      timer = setTimeout(() => resolve(true), killTimeout)
      cp.once('exit', () => resolve())
        .once('error', () => resolve())
    })
    if (!isTimeout) {
      clearTimeout(timer)
      return promise
    }

    cp.kill('SIGKILL') // kill -9
    return promise
  }
}
