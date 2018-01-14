/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import spawn from './spawn-async'

export default class Builder {
  async build() {
    await this.run('eslint', ['configes', 'configrollup'])
    return this.run('rollup', ['--config', 'config/rollup.config.js'])
  }

  async run(cmd, args) {
    console.log(cmd, ...args)
    return spawn(cmd, args)
  }
}
