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


test('package.json main should be set', () => {
  const main = String(Object(pjson).main || '')
  expect(typeof main).toBe('string')
  expect(main).toBeTruthy()
})

test('main should be built', async () => {
  const p = path.resolve(pjson.main)
  const actual = await fs.pathExsists(p)
  expect(actual).toBe(true)
})

test('main exports should be right', () => {
  const babelHelpers = require('babel-helpers')
  const actual = require(path.resolve(pjson.main))
  expect(actual).toEqual(babelHelpers)
})
