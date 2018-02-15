/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json'

import fs from 'fs-extra'

import path from 'path'
import childProcess from 'child_process'
const {ChildProcess} = childProcess

let spawnPromise

test('yarn build should have completed', () => {
  const {main} = Object(pjson)
  if (!main || typeof main !== 'string') throw new Error(`package.json main not non-empty string`)

  const projectDir = path.resolve()
  const allSpawnAbsolute = path.resolve(projectDir, main)
  const srcDir = path.resolve('src')
  const allspawnRelative = path.relative(srcDir, allSpawnAbsolute)

  let allspawn
  let e
  try {
    allspawn = require(allspawnRelative)
  } catch (ee) {
    e = ee
  }
  if (e) expect(`failed to require: '${main}': Error: ${e.message}`).toBeNull()
  expect(typeof allspawn).toBe('object')
  spawnPromise = allspawn.spawnPromise
  expect(typeof spawnPromise).toBe('function')
})

test('spawnPromise', async () => {
  const {cp, promise} = spawnPromise({args: ['node', '--version']})
  expect(cp).toBeInstanceOf(ChildProcess)
  expect(promise).toBeInstanceOf(Promise)
  const resolve = await promise
  expect(resolve).toBe(0)
})
