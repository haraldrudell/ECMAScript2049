/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// rollup ECMAScript 2015: no class properties
import fs from 'fs'
import path from 'path'

export default class PackageJson {
  constructor(o) {
    const {filename = path.join(fs.realpathSync(process.cwd()), 'package.json')} = o || false
    const json = JSON.parse(fs.readFileSync(filename, 'utf8'))
    Object.assign(this, {filename, json})
    if (!json) this._throw('bad json')
  }

  _throw(message, className) {
    throw new Error(`${className || 'PackageJson'}: ${message} in: ${this.filename}`)
  }
}
