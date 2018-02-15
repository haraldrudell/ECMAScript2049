/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import childProcess from 'child_process'
const {spawn} = childProcess

export function spawnPromise(o) {
  // options: cwd env argv0 stdio detached uid gid shell windowsVerbatimArguments windowsHide
  const {cmd, args, options} = getCmdArgs(o)
  let cp = spawn(cmd, args, options)

  const promise = new Promise((resolve, reject) => {
    let e
    cp.once('close', (status, signal) => !e && status === 0 && !signal && resolve(status) ||
        reject(getError({cmd, args, status, signal, e})))
      .on('error', ee => !e && (e = ee)) // subsequent errors are ignored
  })
  return {cp, promise}
}

export function getError({cmd, args, status, signal, e}) {
  let msg = `status code: ${status}`
  if (signal) msg += ` signal: ${signal}`
  msg += ` '${cmd} ${args.join(' ')}'`

  if (!(e instanceof Error)) e = new Error(msg)
  else e.msg = msg

  if (signal === null) signal = undefined
  for (let [property, value] of Object.entries({cmd, args, status, signal})) value !== undefined && (e[property] = value)

  return e
}

export function getCmdArgs(o) {
  let {cmd, args, options} = o || false
  return cmd === undefined && Array.isArray(args)
    ? {cmd: args[0], args: args.slice(1), options}
    : {cmd, args, options}
}
