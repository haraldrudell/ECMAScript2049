/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json'
import path from 'path'

import fs from 'fs-extra'

import childProcess from 'child_process'
const {ChildProcess, execSync} = childProcess

let exportName = 'spawnAsync'
let spawnAsync

test('yarn build should have completed', async () => {
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

  spawnAsync = exportValue
})

test('spawnAsync can launch node', async () => {
  const o = {
    args: ['node', '--version'],
    options: {silent: true},
    //debug: true,
  }
  const statusCode = await spawnAsync(o)
  expect(statusCode).toBe(0)
})

test('spawnAsync cpReceiver works', async () => {
  const cpReceiver = {}
  const o = {
    args: ['node', '--version'],
    options: {silent: true},
    cpReceiver,
  }
  const statusCode = await spawnAsync(o)
  expect(statusCode).toBe(0)
  expect(cpReceiver.cp).toBeInstanceOf(ChildProcess)
})

test('spawnAsync capture works', async () => {
  const nodestdout = 'nodestdout'
  const expected1 = `${nodestdout}\n`
  const nodestderr = 'nodestderr'
  const expected2 = `${nodestderr}\n`
  const o = {
    args: ['node', '--eval', `console.log('${nodestdout}'); console.error('${nodestderr}')`],
    capture: true,
    options: {silent: true},
  }
  const {stdout, stderr} = await spawnAsync(o)
  expect(stdout).toBe(expected1)
  expect(stderr).toBe(expected2)
})

test('spawnAsync capture+stderrFails works', async () => {
  const nodestderr = 'nodestderr'
  const o = {
    args: ['node', '--eval', `console.error('${nodestderr}')`],
    capture: true,
    stderrFails: true,
    options: {silent: true},
  }
  let e
  await spawnAsync(o).catch(ee => e = ee)
  expect(e).toBeInstanceOf(Error)
  /*
  Error: Output on standard error: node --eval console.error('nodestderr'): 'nodestderr'
  cmd: 'node'
  args: [ '--eval', 'console.error(\'nodestderr\')' ]
  stderr: 'nodestderr'
  */
  if (!e.stderr) throw e // some other error
  expect(e.stderr).toBe(nodestderr)
})

test('spawnAsync stderrFails no throw works', async () => {
  const o = {
    args: ['node', '--version'],
    stderrFails: true,
    options: {silent: true},
  }
  const statusCode = await spawnAsync(o)
  expect(statusCode).toBe(0)
})

test('spawnAsync stderrFails works', async () => {
  const nodestderr = 'nodestderr'
  const o = {
    args: ['node', '--eval', `console.error('${nodestderr}'); console.error('more')`],
    stderrFails: true,
    options: {silent: true},
  }
  let e
  await spawnAsync(o).catch(ee => e = ee)
  expect(e).toBeInstanceOf(Error)
  if (!e.stderr) throw e // some other error
  expect(e.stderr).toBe(nodestderr)
})

test('spawnAsync no silent works', async () => {
  /*
  try command-line:
  node --eval "f(); async function f() {await require('./lib/spawn-async').spawnAsync({args: ['node', '--version']})}"
  v9.5.0
  */
  /*
  test echo by sub-process
  console.log(execSync('node --version', {encoding: 'utf8'}))
  v9.5.0
  */
  /*
  test spawnAsync: fails
  console.log('before')
  await spawnAsync({args: ['node', '--version']})
  console.log('after')
  */
  /*
  the test: fails
  - jest captures stdout
  const cmd = `node --eval "f(); async function f() {await require('${allspawnRelative}').spawnAsync({args: ['node', '--version']})}"`
  console.log('cmd', cmd)
  const stdout = execSync(cmd, {encoding: 'utf8'})
   console.log('stdout', typeof stdout, typeof stdout === 'string' && stdout.length, stdout, '<')
   */
})

test('spawnAsync timeout works', async () => {
  const o = {
    args: ['node', '--eval', 'setTimeout(() => 1, 1e3)'],
    options: {silent: true, timeout: 1},
    //debug: true,
  }
  let e
  await spawnAsync(o).catch(ee => e = ee)
  if (!e) expect('Timeout did not trigger').toBeNull()
  expect(e).toBeInstanceOf(Error)
  if (!e.message.match(/^Process timeout/)) throw e // some other error
})
