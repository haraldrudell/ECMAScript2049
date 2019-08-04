/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json'
import path from 'path'

import fs from 'fs-extra'

import childProcess from 'child_process'
const {ChildProcess} = childProcess

let exportName = 'SpawnShim'
let SpawnShim

test('yarn build should have completed', () => {
  const {main} = Object(pjson)
  if (!main || typeof main !== 'string') throw new Error(`package.json main not non-empty string`)

  const projectDir = path.resolve()
  const mainAbsolute = path.resolve(projectDir, main)
  const srcDir = path.resolve('src')
  const mainRelative = path.relative(srcDir, mainAbsolute)

  let packageExports
  try {
    packageExports = require(mainRelative)
  } catch (e) {
    expect(`failed to require: '${mainRelative}' from package.json main: '${main}': Error: ${e.message}`).toBeNull()
  }
  expect(typeof packageExports).toBe('object')
  const exportValue = packageExports[exportName]
  expect(typeof exportValue).toBe('function')

  SpawnShim = exportValue
})

test('SpawnShim.spawn should be able to run node', async () => {
  const o = {
    args: ['node', '--version'],
    //debug: true,
  }
  const spawnShim = new SpawnShim(o)

  const actual = spawnShim.spawn()
  expect(typeof actual).toBe('object')
  const {cp, promise} = actual
  expect(cp).toBeInstanceOf(ChildProcess)
  expect(promise).toBeInstanceOf(Promise)

  const resolution = await promise
  expect(typeof resolution).toBe('object')
  const {e, status, signal} = resolution
  expect(status).toBe(0)
  expect(e).toBeFalsy()
  expect(signal).toBeFalsy()
})

test('SpawnShim.spawn status should work', async () => {
  const status0 = 3
  const o = {
    args: ['node', '--eval', `process.exit(${status0})`],
  }
  const actual = await new SpawnShim(o).spawn().promise
  expect(typeof actual).toBe('object')
  const {status} = actual
  expect(status).toBe(status0)
})

test('SpawnShim.abortprocess should work', async () => {
  const SIGTERM = 'SIGTERM'
  const o = {
    args: ['node', '--eval', `console.log(); setTimeout(() => 1, 1e3)`],
    options: {silent: true},
    //debug: true,
  }
  const spawnShim = new SpawnShim(o)
  const {cp, promise} = spawnShim.spawn()
  new Promise((resolve, reject) => cp.stdout.on('data', resolve))
  await spawnShim.abortProcess()
  const actual = await promise // {e: undefined, status: null, signal: }
  expect(actual).toBeTruthy()
  const {signal} = actual
  expect(signal).toBe(SIGTERM)
})
