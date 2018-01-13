/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import babelEnv from './babelenv'

import babel from 'babel-core'

import path from 'path'
import fs from 'fs-extra'
import util from 'util'

export default class ScriptTranspiler {
  js = '.js'
  mjs = '.mjs'
  envKeepMjs = 'latest'

  constructor(o) {
    const {name, envName, debug} = o || false
    const m = String(name || 'ScriptTranspiler')
    const env = this.getEnv(envName)
    const babelOptions = babelEnv[env]
    if (!babelOptions) throw new Error(`${m} Unknown Babel envName: '${env}'`)
    const keepMjsExt = env === this.envKeepMjs
    const envFriendly = this.getPrintableEnv(envName)
    const cwd = process.cwd()
    Object.assign(this, {babelOptions, envFriendly, debug, cwd, keepMjsExt})
    debug && console.log(`env: ${env} ${envFriendly} mjs: ${keepMjsExt}`, util.inspect(babelEnv, {depth: null, colors: true}))
  }

  async transpile({from, to}) {
    if (!await fs.pathExists(from) || !(await fs.stat(from)).isDirectory()) throw new Error(`${this.m} not directory: '${from}'`)
    return this.transpileDirectory(from, to)
  }

  async transpileDirectory(from, to, all) {
    const [exists, entries] = await Promise.all([
      fs.pathExists(to),
      fs.readdir(from),
    ])
    if (!exists) {
      all = true
      await fs.ensureDir(to)
    }

    const ps = []
    for (let entry of entries) {
      const absolute = path.join(from, entry)
      if ((await fs.stat(absolute)).isDirectory()) {
        ps.push(this.transpileDirectory(absolute, path.join(to, entry), all))
        continue
      }
      const ext = path.extname(entry)
      const toExt = this.getToExt(ext)
      const dest = path.join(to, ext === toExt ? entry : entry.slice(0, -ext.length) + toExt)
      if (!all && !await this.needsUpdate(absolute, dest)) continue
      ps.push(!this.shouldTranspile(ext)
        ? fs.copy(absolute, dest)
        : this.transpileFile(absolute, dest))
    }
    return Promise.all(ps)
  }

  async transpileFile(from, to) {
    const {debug, cwd, babelOptions, envFriendly} = this
    debug && console.log(`transpile: ${path.relative(cwd, from)} ` +
      `to ${path.relative(cwd, to)} ` +
      `env ${envFriendly}`)
    const {code/*, map, ast*/} = await new Promise((resolve, reject) =>
      babel.transformFile(from, babelOptions, (e, r) => !e ? resolve(r) : reject(e)))
    await fs.writeFile(to, code)
  }

  getEnv = env => String(env || process.env.BABEL_ENV || process.env.NODE_ENV || 'development')

  getPrintableEnv(env) {
    if (env) return env
    const be = process.env.BABEL_ENV
    if (be) return `BABEL_ENV=${be}`
    const ne = process.env.NODE_ENV
    if (ne) return `NODE_ENV=${ne}`
    return 'default: development'
  }

  async needsUpdate(from, to) {
    if (!await fs.pathExists(to)) return true
    const [sFrom, sTo] = await Promise.all([
      fs.stat(from),
      fs.stat(to),
    ])
    return sFrom.mtimeMs > sTo.mtimeMs
  }

  shouldTranspile = ext => ext === this.js || ext === this.mjs
  getToExt = ext => ext !== this.mjs || this.keepMjsExt ? ext : this.js
}
