/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {spawnPromise} from './spawnPromise'
import Capturer from './Capturer'
import Timer from './Timer'

export default class SpawnAsync {
  static optionsProperties = Object.keys({timeout: 1, maxBuffer: 1, silent: 1})
  static killTimeout = 3e3
  setExit = () => this.isExit = true
  onTimeout = this.onTimeout.bind(this)

  static async spawnAsync(o) {
    return new SpawnAsync(o).spawn()
  }

  constructor(o) {
    const {cmd, args, options: options0, cpReceiver, echo, capture, stderrFails, debug, killTimeout: kt} = Object(o)
    this.m = 'SpawnAsync'
    const killTimeout = Number(kt > 0 ? kt : SpawnAsync.killTimeout)
    Object.assign(this, {cmd, args, cpReceiver, echo, capture, stderrFails, killTimeout, debug})
    this.cmdString = `${cmd || ''} ${Array.isArray(args) ? args.join('\x20') : ''}`

    const isGood = options0 === undefined || typeof options0 === 'object'
    const options = this.options = isGood ? {...options0} : options0
    const opts = Object(options)
    this.timeout = opts.timeout >= 0 ? +opts.timeout : 0
    this.maxBuffer = opts.maxBuffer >= 0 ? +opts.maxBuffer : 200*1024
    const silent = this.silent = !!opts.silent
    for (let property of SpawnAsync.optionsProperties) delete opts[property]

    if (isGood) {
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
    debug && console.log(`${this.m} constructor:`, this)
  }

  async spawn() {
    const {timeout, onTimeout, debug} = this
    return (await Promise.all([
        this.spawn2(),
      ].concat(
        timeout > 0
          ? [(this.timer = new Timer({timeout, onTimeout, debug})).start()]
          : []
        )))[0]
  }

  async spawn2() {
    const {echo, cmdString, cmd, args, options, cpReceiver, capture, stderrFails, silent} = this
    echo && console.log(cmdString)
    const {cp, promise} = spawnPromise({cmd, args, options})
    cpReceiver && (cpReceiver.cp = cp)
    this.cp = cp.once('exit', this.setExit)
      .once('error', this.setExit)
    this.promise = promise

    // assemble promises
    const ps = []
    const capturers = capture && ['stdout', 'stderr'].map(stream => new Capturer({input: cp[stream], pipe: !silent && process[stream]}))
    if (capturers) ps.push.apply(ps, capturers.map(c => c.promise))
    ps.push(promise)
    if (!capturers && stderrFails) ps.push(this.doStderrFails())

    let e
    const results = await Promise.all(ps).catch(ee => (e = ee))

    const {isTimeout, timer} = this
    if (e && isTimeout && (e.signal === 'SIGTERM' || e.signal === 'SIGKILL')) {
      e = Object.assign(new Error(`Process timeout: ${(this.timeout / 1e3).toFixed(1)} s: ${cmdString}`), {cmd, args})
    } else timer && timer.cancel()
    if (e) throw e

    if (capturers) {
      const [stdout, stderr] = results
      if (stderrFails && stderr) {
        const s = this.trimEnd(stderr)
        throw Object.assign(new Error(`Output on standard error: ${cmdString}: '${s}'`), {cmd, args, stderr: s})
      }
      return {stdout, stderr}
    } else return results[0]
  }

  onTimeout() {
    const {debug} = this
    debug && console.log(`${this.m}.onTimeout`)
    this.isTimeout = true
    return this.abortProcess()
  }

  async abortProcess() {
    const {isExit, debug, killTimeout} = this
    debug && console.log(`${this.m} abortProcess: isExit: ${isExit}`)
    if (!this.isExit) {
      const {cp} = this
      if (!cp.killed) {
        debug && console.log(`${this.m} cp.kill…`)
        cp.kill()
      }
      let timer
      const isTimeout = await new Promise((resolve, reject) => {
        timer = setTimeout(() => resolve(true, killTimeout), killTimeout)
        cp.once('exit', () => resolve())
          .once('error', () => resolve())
      })
      if (!isTimeout) clearTimeout(timer)
      else {
        cp.kill('SIGKILL') // kill -9
        return this.promise
      }
    }
  }

  async doStderrFails() {
    const {cp: {stderr}, cmdString, cmd, args} = this
    const text0 = await new Promise((resolve, reject) => stderr
      .once('data', textx => textx && resolve(textx))
      .once('close', () => resolve())
      .setEncoding('utf8'))
    const text = this.trimEnd(text0)
    if (text) throw Object.assign(new Error(`Output on standard error: ${cmdString}: '${text}'`), {cmd, args, stderr: text})
  }

  trimEnd(s) {
    if (typeof s === 'string' && s.endsWith('\n')) return s.slice(0, -1)
    return s
  }
}
