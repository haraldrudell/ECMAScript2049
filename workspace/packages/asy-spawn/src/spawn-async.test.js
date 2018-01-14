/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import pjson from '../package.json'

import fs from 'fs-extra'

import path from 'path'

test('Test package.json main commonJS export', async () => {
  const mainKey = getNonEmptyString(Object(pjson).main, 'package.json: main')

  let main = path.resolve(mainKey)
  if (!await fs.pathExists(main)) {
    const tried = [main]
    if (!path.extname(mainKey)) {
      if (await fs.pathExists(main += '.js')) tried.length = 0
      else tried.push(main)
    }
    if (tried.length) throw new Error(`main export does not exist, did yarn build complete? tried: '${tried.join('\', \'')}'`)
  }

  const mainExports = require(main)
  expect(typeof mainExports).toBe('object')
  const spawn = mainExports.default
  expect(typeof spawn).toBe('function')
})

function getNonEmptyString(value, m) {
  const t = typeof value
  if (t !== 'string' || !value) throw new Error(`${m}: not non-empty string: ${t}`)
  return value
}
