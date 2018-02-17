/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import SpawnAsync from './SpawnAsync'

export async function spawnCapture(o) {
  const spawnAsync = new SpawnAsync({
    stderrFails: true,
    ...o,
    capture: true,
    options: {
      timeout: 3e3,
      silent: true,
      ...Object(o).options,
    }})
  const result = await spawnAsync.startSpawn()
  const {stdout, stderr} = result
  result.stdout = spawnAsync.trimEnd(stdout)
  result.stderr = spawnAsync.trimEnd(stderr)
  return result
}
