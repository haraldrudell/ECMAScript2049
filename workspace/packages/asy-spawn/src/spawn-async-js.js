/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import childProcess from 'child_process'
const spawn = childProcess.spawn

export default async function spawnAsync(cmd, args, options, cp) {
  if (!cp) cp = {}
  return new Promise((resolve, reject) =>
    cp.cp = spawn(cmd, args, {stdio: ['ignore', 'inherit', 'inherit'], ...options})
      .once('close', (status, signal) => status === 0 && !signal && resolve(status) ||
        reject(getError(cmd, args, status, signal)))
      .on('error', reject))
}

function getError(cmd, args, status, signal) {
  let msg = `status code: ${status}`
  if (signal) msg += ` signal: ${signal}`
  msg += ` '${cmd} ${args.join(' ')}'`
  const e = new Error(msg)
  Object.assign(e, {status, signal, cmd, args})
  return e
}
