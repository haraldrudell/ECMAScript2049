/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'

import path from 'path'
import childProcess from 'child_process'
const spawn = childProcess.spawn

export default class ZeroTranspiler {
  config = 'config'
  configRollup = 'configrollup'
  configES = 'configes'
  mjs = '.mjs'
  js = '.js'
  babelrc = path.resolve('config/babel85.js')
  babeles = path.resolve('config/babeles.js')

  constructor(o) {
    const {debug} = o || false
    Object.assign(this, {debug})
  }

  async transpile() {
    const {config, configRollup, configES, babelrc, babeles} = this
    await this.transpileFilesMjsToJs(configRollup, config, babeles)
    return this.transpileFilesMjsToJs(configES, config, babelrc)
  }

  async transpileFilesMjsToJs(fromDirectory, toDirectory, babelrc) {
    return Promise.all((await fs.readdir(fromDirectory))
      .map(file => this.transpileFile(
        path.join(fromDirectory, file),
        path.join(toDirectory, this.mjsToJs(file)),
        babelrc,
      )))
  }

  async transpileFile(from, to, babelrc) {
    return this.spawn(...this.getBabelCmd(from, to, babelrc))
  }

  mjsToJs(filename) {
    const {mjs, js} = this
    return filename.endsWith(mjs)
      ? filename.slice(0, -mjs.length) + js
      : filename
  }

  getBabelCmd(from, to, babelrc) {
    return ['babel', ['--out-file', to, '--config-file', babelrc, from]]
  }

  async spawn(cmd, args) {
    this.debug && console.log(cmd, ...args)
    return new Promise((resolve, reject) =>
      spawn(cmd, args, {stdio: ['ignore', 'inherit', 'inherit']})
        .once('close', (status, signal) => status === 0 && !signal && resolve(status) ||
          reject(this.getError(cmd, args, status, signal)))
        .on('error', reject))
  }

  getError(cmd, args, status, signal) {
    let msg = `status code: ${status}`
    if (signal) msg += ` signal: ${signal}`
    msg += ` '${cmd} ${args.join(' ')}'`
    const e = new Error(msg)
    Object.assign(e, {status, signal, cmd, args})
    return e
  }
}
