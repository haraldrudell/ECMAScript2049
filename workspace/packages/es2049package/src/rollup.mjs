/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {spawn} from 'child_process'
import path from 'path'

execCommand(path.join(__dirname, '..')).catch(errorHandler)

async function execCommand(rollupConfigProjectDir) {
  const realRollupExecutable = path.join(rollupConfigProjectDir, 'node_modules', '.bin', 'rollup')
  const args = process.argv.slice(2)
  const {status, signal} = await new Promise((resolve, reject) => spawn(realRollupExecutable, args, {stdio: 'inherit'})
    .once('close', (st, si) => resolve({status: st, signal: si}))
    .on('error', reject)
  )
  if (signal) throw new Error(`signal: ${signal} status: ${status} from ${realRollupExecutable}`)
  process.exit(status)
}

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
}
