/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import childProcess from 'child_process'
const cspawn = childProcess.spawn

export default class Build {
  async build() {
    await this.run('eslint', ['configes', 'configrollup'])
    await this.run('rollup', ['--config', 'config/rollup.config.js'])
  }

  async run(cmd, args) {
    console.log(`${cmd} ${args.join(' ')}`)
    return new Promise((resolve, reject) =>
      cspawn(cmd, args, {stdio: ['ignore', 'inherit', 'inherit']})
        .once('close', (status, signal) => {
          if (status === 0 && !signal) resolve(status)
          else {
            let msg = `status code: ${status}`
            if (signal) msg += ` signal: ${signal}`
            msg += ` '${cmd} ${args.join(' ')}'`
            const e = new Error(msg)
            Object.assign(e, {status, signal})
            reject(e)
          }
        }).on('error', reject))
  }
}
