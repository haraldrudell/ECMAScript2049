/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import presetEsNext from '../lib/rollup-preset-7-esnext'

it('works', () => {
  expect(typeof presetEsNext).toBe('function')
  const plugins = presetEsNext()
  expect(Array.isArray(plugins)).toBeTruthy()
  //console.log(plugins)
})