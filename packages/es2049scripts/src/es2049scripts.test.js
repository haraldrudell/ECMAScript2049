/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json'

import path from 'path'
import fs from 'fs-extra'
import childProcess from 'child_process'
const {spawn} = childProcess

const outputDir = 'bin'

const name = String(Object(pjson).name || '')
if (!name) throw new Error('package.json name not defined')

const output = path.resolve(outputDir, name)

test('npm run build should have been run', async () => {
  const exists = await fs.pathExists(output)
  expect(exists).toBe(true)
})

test('Executable should be runnable', async () => {
  const cmd = output
  const args = ['-help']

  const exitCode = await new Promise((resolve, reject) =>
    spawn(cmd, args, {stdio: ['ignore', 'inherit', 'inherit']})
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
  expect(exitCode).toBe(0)
})
