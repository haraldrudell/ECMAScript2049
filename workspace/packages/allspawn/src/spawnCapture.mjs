/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import SpawnAsync from './SpawnAsync'

export function spawnCapture(o) {
  return SpawnAsync.spawnAsync({
    capture: true,
    stderrFails: true,
    ...o,
    options: {
      timeout: 3e3,
      silent: true,
      ...Object(o).options,
    }})
}
