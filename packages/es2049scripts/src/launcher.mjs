/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import childProcess from 'child_process'
const cspawn = childProcess.spawn

import fs from 'fs-extra'
import path from 'path'

const nmbin = path.resolve('node_modules', '.bin')

export default async function spawn(o) {
  const {cmd, args = [], options, cp} = o || false
  if (typeof cmd !== 'string' || !cmd) throw new Error('spawn-async: command not non-empty string')
  if (!Array.isArray(args)) throw new Error('spawn-async: args not array')
  const cmd1 = await checkNm(cmd)

  return new Promise((resolve, reject) => {
    const c = cspawn(cmd1, args, {stdio: ['ignore', 'inherit', 'inherit'], ...options})
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
      }).on('error', reject)
      if (cp) cp.cp = c
    })
}

export async function checkNm(cmd) {
  if (path.dirname(cmd) === '.') {
    const cmd1 = path.join(nmbin, cmd)
    if (await(fs.pathExists(cmd1))) return cmd1
  }
  return cmd
}
