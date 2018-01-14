/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import childProcess from 'child_process'
const spawn = childProcess.spawn

export async function spawnAsync(cmd, args, options, cp) {
  if (!cp) cp = {}
  return new Promise((resolve, reject) =>
    cp.cp = spawn(cmd, args, {stdio: ['ignore', 'inherit', 'inherit'], ...options})
      .once('close', (status, signal) => status === 0 && !signal && resolve(status) ||
        reject(getError(cmd, args, status, signal)))
      .on('error', reject))
}

export async function spawnCapture(cmd, args, options) {
  options = {...options, stdio: ['ignore', 'pipe', 'pipe']}
  const {doPipe, stderrFails} = options
  delete options.doPipe
  delete options.stderrFails

  const cpv = {}
  const p = spawnAsync(cmd, args, options, cpv)

  const texts = ['', '']
  const fns = texts.map((text, ix) => t => texts[ix] += t)
  const {cp: {stdout: cpOut, stderr: cpErr}} = cpv
  const streams = [cpOut, cpErr]
  streams.forEach((stream, ix) => stream.on('data', fns[ix]))
  if (doPipe) {
    const {stdout, stderr} = process
    for (let [ix, s] of [stdout, stderr]) streams[ix].pipe(s)
  }

  let e
  await p.catch(er => e = er)
  streams.forEach((stream, ix) => stream.removeListener('data', fns[ix]))
  if (e) throw e
  const [stdout, stderr] = texts
  if (stderrFails && stderr) throw new Error(`Output on standard error: ${cmd} ${args.join(' ')}: '${stderr}`)
  return {stdout, stderr}
}

export function getError(cmd, args, status, signal) {
  let msg = `status code: ${status}`
  if (signal) msg += ` signal: ${signal}`
  msg += ` '${cmd} ${args.join(' ')}'`
  const e = new Error(msg)
  Object.assign(e, {status, signal, cmd, args})
  return e
}
