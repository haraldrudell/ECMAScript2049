/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json'

import fs from 'fs-extra'

import path from 'path'
import childProcess from 'child_process'
const {ChildProcess, execSync} = childProcess

const {main} = Object(pjson)
if (!main || typeof main !== 'string') throw new Error(`package.json main not non-empty string`)

const projectDir = path.resolve()
const allSpawnAbsolute = path.resolve(projectDir, main)
const srcDir = path.resolve('src')
const allspawnRelative = path.relative(srcDir, allSpawnAbsolute)

let spawnCapture

test('yarn build should have completed', async () => {
  let allspawn
  let e
  try {
    allspawn = require(allspawnRelative)
  } catch (ee) {
    e = ee
  }
  if (e) expect(`failed to require: '${main}': Error: ${e.message}`).toBeNull()
  expect(typeof allspawn).toBe('object')
  spawnCapture = allspawn.spawnCapture
  expect(typeof spawnCapture).toBe('function')
})

test('spawnCapture captures silently', async () => {
  // node --eval "require('./lib/spawn-async.js').spawnCapture({args: ['node', '--version'], debug: true})"
  const o = {
    args: ['node', '--version'],
  }
  const result = await spawnCapture(o)
  expect(typeof result).toBe('object')
  const {stdout, stderr} = result
  expect(stderr).toMatch(/^$/)
  expect(stdout.substring(0,1)).toMatch('v')
})
