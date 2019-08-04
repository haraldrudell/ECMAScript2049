/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import InstallTester from './InstallTester'

import pjson from '../package.json'

test('Test package.json main commonJS export', async () => {
  const seconds25 = 25e3
  const jestTimeout = seconds25
  const name = getNonEmptyString(Object(pjson).name, 'package.json: name')
  jest.setTimeout(jestTimeout)
  await new InstallTester().test(name)
})

function getNonEmptyString(value, m) {
  const t = typeof value
  if (t !== 'string' || !value) throw new Error(`${m}: not non-empty string: ${t}`)
  return value
}
