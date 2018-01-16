/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import babelEnv from './babelenv'

import babel from 'babel-core'
import fs from 'fs-extra'

import path from 'path'
import util from 'util'

export default class ScriptTranspiler {
  js = '.js'
  mjs = '.mjs'
  envKeepMjs = 'latest'

  constructor(o) {
    if (!o) o = false
    const m = String(o.name || 'ScriptTranspiler')
    const debug = Boolean(o.debug)
    const {envName} = o
    const env = this.getEnv(envName)
    const babelOptions = babelEnv[env]
    if (!babelOptions) throw new Error(`${m} Unknown Babel envName: '${env}'`)
    const keepMjsExt = env === this.envKeepMjs
    const envFriendly = this.getPrintableEnv(envName)
    const cwd = process.cwd()
    Object.assign(this, {m, babelOptions, envFriendly, debug, cwd, keepMjsExt})
    debug && console.log(`${m} constructor env: ${env}`,
      {envFriendly, debug, cwd, keepMjsExt},
      'babelEnv:', util.inspect(babelEnv, {depth: null, colors: true}))
  }

  async transpile(o) {
    if (!o) o = false
    if (!o.to) throw new Error(`${this.m} to cannot be empty`)
    const to = String(o.to)
    const from = String(o.from || '')
    if (!from || !await fs.pathExists(from) || !(await fs.stat(from)).isDirectory()) throw new Error(`${this.m} not directory: '${from}'`)
    return this.transpileDirectory({from, to})
  }

  async transpileDirectory({from, to, all}) {
    this.debug && console.log(`${this.m}.transpileDirectory ${from}`)
    const [exists, entries] = await Promise.all([
      fs.pathExists(to),
      fs.readdir(from),
    ])
    if (!exists) {
      all = true
      await fs.ensureDir(to)
    }
    return Promise.all(entries.map(entry => this.processEntry({entry, from, to, all})))
  }

  async processEntry({entry, from, to, all}) {
    const absolute = path.join(from, entry)
    if ((await fs.stat(absolute)).isDirectory()) return this.transpileDirectory({from: absolute, to: path.join(to, entry), all})
    const ext = path.extname(entry)
    const toExt = this.getToExt(ext)
    const dest = path.join(to, ext === toExt ? entry : entry.slice(0, -ext.length) + toExt)
    if (all || await this.needsUpdate(absolute, dest)) return !this.shouldTranspile(ext)
      ? fs.copy(absolute, dest)
      : this.transpileFile(absolute, dest)
  }

  async transpileFile(from, to) {
    const {debug, cwd, babelOptions} = this
    debug && console.log(`transpileFile: ${path.relative(cwd, from)} ` +
      `to ${path.relative(cwd, to)} `)
    const {code/*, map, ast*/} = await new Promise((resolve, reject) =>
      babel.transformFile(from, babelOptions, (e, r) => !e ? resolve(r) : reject(e)))
    return fs.writeFile(to, code)
  }

  getEnv = env => String(env || process.env.BABEL_ENV || process.env.NODE_ENV || 'development')

  getPrintableEnv(env) {
    if (env) return String(env)
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
